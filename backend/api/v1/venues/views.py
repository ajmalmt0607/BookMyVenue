import logging
import uuid
from datetime import datetime

from django.conf import settings
from django.core.cache import cache
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

import stripe
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.pagination import StandardPagination
from apps.venues.models import (
    Amenity,
    Booking,
    PolicyType,
    Venue,
    VenuePolicy,
    VenueTimeSlot,
    VenueType,
)
from apps.venues.services.booking.availability_service import (
    AvailabilityService,
    availability_cache_key,
)
from apps.venues.services.booking.booking_service import BookingService, SlotUnavailableError
from apps.venues.services.booking.payment_service import PaymentService
from apps.venues.services.booking.pricing_service import PricingService
from apps.venues.services.locations.factory import get_location_service
from apps.venues.services.reviews.review_service import ReviewService

from api.v1.venues.filters import VenueFilter
from api.v1.venues.serializers import (
    AmenitySerializer,
    AvailableSlotSerializer,
    BookingDetailSerializer,
    ConfirmBookingSerializer,
    PolicyTypeSerializer,
    ReviewSerializer,
    VenueDetailSerializer,
    VenueListSerializer,
    VenueTypeSerializer,
)

logger = logging.getLogger(__name__)


class LocationSearchAPIView(
    APIView
):

    def get(
        self,
        request,
        *args,
        **kwargs,
    ):

        query = request.GET.get(
            "query",
            "",
        )

        if not query:
            return Response([])

        service = get_location_service()

        locations = (
            service.search_locations(
                query=query,
            )
        )

        return Response(
            locations
        )


class LocationReverseGeocodeAPIView(
    APIView
):

    permission_classes = [AllowAny]

    def get(
        self,
        request,
        *args,
        **kwargs,
    ):

        latitude = request.GET.get("lat")
        longitude = request.GET.get("lng")

        try:
            latitude = float(latitude)
            longitude = float(longitude)

        except (TypeError, ValueError):
            return Response(
                {
                    "message": "Valid lat and lng query params are required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service = get_location_service()

        location = service.reverse_geocode(
            latitude=latitude,
            longitude=longitude,
        )

        if location is None:
            return Response(
                {
                    "message": "Couldn't resolve an address for that location.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(location)


class VenueTypeListAPIView(ListAPIView):

    permission_classes = [AllowAny]
    pagination_class = None
    serializer_class = VenueTypeSerializer
    queryset = VenueType.objects.filter(is_active=True)


class AmenityListAPIView(ListAPIView):
    permission_classes = [AllowAny]
    pagination_class = None
    serializer_class = AmenitySerializer
    queryset = Amenity.objects.filter(is_active=True)


class PolicyTypeListAPIView(ListAPIView):
    permission_classes = [AllowAny]
    pagination_class = None
    serializer_class = PolicyTypeSerializer
    queryset = PolicyType.objects.filter(is_active=True)


class VenueListAPIView(ListAPIView):

    serializer_class = VenueListSerializer

    pagination_class = StandardPagination

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = VenueFilter

    search_fields = [
        "name",
        "location_name",
        "city",
    ]

    ordering_fields = [
        "price_per_day",
        "rating",
        "created_at",
        "max_capacity",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):

        return (
            Venue.active_objects
            .filter(
                status=Venue.Status.APPROVED,
                is_active=True,
            )
            .select_related(
                "venue_type",
                "owner",
            )
            .prefetch_related(
                "images",
                "amenities",
            )
        )
    

class VenueDetailAPIView(RetrieveAPIView):

    serializer_class = VenueDetailSerializer

    lookup_field = "slug"

    def get_queryset(self):

        active_policies = (
            VenuePolicy.objects
            .filter(is_active=True)
            .select_related("policy_type")
            .order_by("display_order")
        )

        return (
            Venue.objects
            .filter(
                status=Venue.Status.APPROVED,
                is_active=True,
            )
            .select_related(
                "venue_type",
                "owner",
            )
            .prefetch_related(
                "amenities",
                "images",
                Prefetch("policies", queryset=active_policies),
            )
        )


class VenueAvailabilityAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, slug):

        date_str = request.GET.get("date")

        if not date_str:
            return Response(
                {
                    "success": False,
                    "message": "Date is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            selected_date = datetime.strptime(
                date_str,
                "%Y-%m-%d",
            ).date()

        except ValueError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid date format. Use YYYY-MM-DD.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        today = timezone.localdate()

        if selected_date < today:
            return Response(
                {
                    "success": False,
                    "message": "Past dates cannot be booked.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        venue = get_object_or_404(
            Venue.active_objects.select_related(
                "venue_type",
            ),
            slug=slug,
            status=Venue.Status.APPROVED,
            is_active=True,
        )

        cache_key = availability_cache_key(
            venue,
            selected_date,
        )

        data = cache.get(cache_key)

        if data is None:

            slots = AvailabilityService.get_available_slots(
                venue,
                selected_date,
            )

            data = AvailableSlotSerializer(
                slots,
                many=True,
            ).data

            cache.set(cache_key, data)

        return Response(
            {
                "success": True,
                "message": "Available slots fetched successfully.",
                "data": data,
            },
            status=status.HTTP_200_OK,
        )


class VenueReviewListAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, slug):

        venue = get_object_or_404(
            Venue.active_objects.only("id", "slug"),
            slug=slug,
            status=Venue.Status.APPROVED,
            is_active=True,
        )

        context = ReviewService.get_review_context(venue)

        serializer = ReviewSerializer(
            context["reviews"],
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "success": True,
                "message": "Reviews fetched successfully.",
                "data": {
                    "reviews": serializer.data,
                    "average_rating": context["average_rating"],
                    "total_reviews": context["total_reviews"],
                    "has_more_reviews": context["has_more_reviews"],
                },
            },
            status=status.HTTP_200_OK,
        )


class BookingQuoteAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        venue_id = request.GET.get("venue_id")

        slot_ids = [
            slot_id
            for slot_id in request.GET.get("slot_ids", "").split(",")
            if slot_id
        ]

        if not venue_id or not slot_ids:
            return Response(
                {
                    "success": False,
                    "message": "venue_id and slot_ids are required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            uuid.UUID(venue_id)
            slot_ids = [str(uuid.UUID(slot_id)) for slot_id in slot_ids]

        except ValueError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid venue_id or slot_ids.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        venue = get_object_or_404(
            Venue,
            id=venue_id,
            status=Venue.Status.APPROVED,
            is_active=True,
        )

        slots = VenueTimeSlot.objects.filter(
            id__in=slot_ids,
            venue=venue,
            is_active=True,
        )

        if not slots.exists():
            return Response(
                {
                    "success": False,
                    "message": "No valid slots selected.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        venue_amount = sum(
            slot.price
            for slot in slots
        )

        price = PricingService.calculate(
            venue_amount
        )

        return Response(
            {
                "success": True,
                "message": "Quote calculated successfully.",
                "data": {
                    "slots": AvailableSlotSerializer(
                        slots,
                        many=True,
                    ).data,
                    **price,
                },
            }
        )


class ConfirmBookingAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ConfirmBookingSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        data = serializer.validated_data

        venue = get_object_or_404(
            Venue,
            id=data["venue_id"],
            status=Venue.Status.APPROVED,
            is_active=True,
        )

        if not (venue.min_capacity <= data["guest_count"] <= venue.max_capacity):
            return Response(
                {
                    "message": (
                        f"Guest count must be between {venue.min_capacity} "
                        f"and {venue.max_capacity} for this venue."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            booking = BookingService.create_reservation(
                customer=request.user,
                venue=venue,
                booking_date=data["booking_date"],
                slot_ids=data["slot_ids"],
                guest_count=data["guest_count"],
                full_name=data["full_name"],
                email=data["email"],
                phone_number=data["phone_number"],
                alternate_phone_number=data.get("alternate_phone_number", ""),
                special_requirements=data.get("special_requirements", ""),
                arrival_notes=data.get("arrival_notes", ""),
                event_notes=data.get("event_notes", ""),
                terms_accepted=data["terms_accepted"],
            )

        except SlotUnavailableError as exc:
            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_409_CONFLICT,
            )

        except ValueError as exc:
            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment, intent = PaymentService.create_payment_intent(
                booking
            )

        except ValueError as exc:
            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "booking_id": booking.id,
                "reserved_until": booking.reserved_until,
                "client_secret": intent.client_secret,
                "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
            }
        )


class BookingDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        booking = get_object_or_404(
            Booking.objects.select_related(
                "venue",
                "venue__venue_type",
                "payment",
            ).prefetch_related(
                "venue__images",
                "slots__slot",
            ),
            id=pk,
            customer=request.user,
        )

        serializer = BookingDetailSerializer(
            booking,
            context={
                "request": request,
            },
        )

        return Response(serializer.data)
    

class CancelBookingAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        booking = get_object_or_404(
            Booking,
            id=pk,
            customer=request.user,
        )

        BookingService.cancel_reservation(
            booking
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class InitiatePaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        booking = get_object_or_404(
            Booking,
            id=pk,
            customer=request.user,
        )

        if not BookingService.validate_reservation(
            booking
        ):
            return Response(
                {
                    "message": "Reservation has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment, intent = PaymentService.create_payment_intent(
                booking
            )

        except ValueError as exc:
            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "client_secret": intent.client_secret,
                "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
                "amount": payment.amount,
                "currency": settings.STRIPE_CURRENCY,
            }
        )


class ConfirmPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        booking = get_object_or_404(
            Booking.objects.select_related(
                "payment"
            ),
            id=pk,
            customer=request.user,
        )

        payment = PaymentService.sync_payment_status(
            booking
        )

        booking.refresh_from_db()

        return Response(
            {
                "booking_status": booking.status,
                "payment_status": (
                    payment.status
                    if payment
                    else None
                ),
            }
        )


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookAPIView(APIView):

    authentication_classes = []

    permission_classes = [AllowAny]

    def post(self, request):

        payload = request.body

        sig_header = request.META.get(
            "HTTP_STRIPE_SIGNATURE"
        )

        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET,
            )

        except (
            ValueError,
            stripe.error.SignatureVerificationError,
        ):
            logger.warning(
                "Stripe webhook: signature verification failed"
            )
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )

        event_type = event["type"]
        intent = event["data"]["object"]

        logger.info(
            "Stripe webhook: received event %s (type=%s intent=%s)",
            event["id"],
            event_type,
            intent["id"],
        )

        if event_type == "payment_intent.succeeded":
            PaymentService.handle_payment_intent_succeeded(
                intent
            )

        elif event_type == "payment_intent.payment_failed":
            PaymentService.handle_payment_intent_failed(
                intent
            )

        return Response(
            status=status.HTTP_200_OK
        )
