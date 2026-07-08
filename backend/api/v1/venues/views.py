from datetime import datetime
from apps.venues.services.booking.booking_service import BookingService
from rest_framework import status
from api.v1.venues.filters import VenueFilter
from rest_framework.filters import (
    OrderingFilter,
    SearchFilter,
)
from apps.venues.models import Booking, BookingSlot, Venue, VenueTimeSlot
from apps.common.pagination import StandardPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .serializers import AvailableSlotSerializer, BookingDetailSerializer, ReserveBookingSerializer, UpdateBookingCustomerSerializer, VenueDetailSerializer, VenueListSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

from datetime import date
from django.db.models import Exists, OuterRef
from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.venues.services.locations.factory import (
    get_location_service,
)


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

        booked_slots_subquery = (
            BookingSlot.objects.filter(
                slot=OuterRef("pk"),
                booking__booking_date=selected_date,
                booking__status=Booking.Status.CONFIRMED,
            )
        )

        slots = (
            VenueTimeSlot.objects
            .filter(
                venue=venue,
                is_active=True,
            )
            .annotate(
                is_booked=Exists(
                    booked_slots_subquery
                )
            )
            .filter(
                is_booked=False
            )
            .order_by(
                "start_time"
            )
        )

        if selected_date == today:

            current_time = timezone.localtime().time()

            slots = slots.filter(
                start_time__gt=current_time
            )

        serializer = AvailableSlotSerializer(
            slots,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Available slots fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    

class ReserveBookingAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ReserveBookingSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        venue = get_object_or_404(
            Venue,
            id=serializer.validated_data["venue_id"],
            status=Venue.Status.APPROVED,
            is_active=True,
        )

        booking = (
            BookingService.create_reservation(
                customer=request.user,
                venue=venue,
                booking_date=serializer.validated_data["booking_date"],
                slot_ids=serializer.validated_data["slot_ids"],
            )
        )

        return Response(
            {
                "booking_id": booking.id,
                "reserved_until": booking.reserved_until,
            }
        )
    

class BookingDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        booking = get_object_or_404(
            Booking.objects.select_related(
                "venue",
                "venue__venue_type",
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
    

class ValidateReservationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        booking = get_object_or_404(
            Booking,
            id=pk,
            customer=request.user,
        )

        valid = (
            BookingService.validate_reservation(
                booking
            )
        )

        return Response(
            {
                "valid": valid
            }
        )
    

class BookingCustomerDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        booking = get_object_or_404(
            Booking,
            id=pk,
            customer=request.user,
            status=Booking.Status.RESERVED,
        )

        # Reservation validation
        if not BookingService.validate_reservation(
            booking
        ):
            return Response(
                {
                    "message": "Reservation has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UpdateBookingCustomerSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        BookingService.update_customer_details(
            booking=booking,
            validated_data=serializer.validated_data,
        )

        return Response(
            {
                "message": "Booking details updated successfully."
            }
        )