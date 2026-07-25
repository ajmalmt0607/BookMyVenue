from django.shortcuts import get_object_or_404
from django.utils.functional import cached_property

from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.pagination import StandardPagination
from apps.venues.models import Venue, VenueImage
from apps.venues.services.owner.dashboard_service import OwnerDashboardService
from apps.venues.services.owner.venue_draft_service import (
    VenueDraftService,
    VenueSubmissionError,
)
from apps.venues.services.owner.venue_image_service import VenueImageService

from api.v1.accounts.permissions import IsVenueOwner
from api.v1.owner.serializers import (
    OwnerDashboardSerializer,
    OwnerVenueDetailSerializer,
    OwnerVenueListSerializer,
    VenueAmenitiesUpdateSerializer,
    VenueBasicInfoSerializer,
    VenueDraftCreateSerializer,
    VenueDraftProgressSerializer,
    VenueImageReorderSerializer,
    VenueImageUploadSerializer,
    VenuePoliciesUpdateSerializer,
    VenueTimeSlotWriteSerializer,
)
from api.v1.venues.serializers import (
    AmenitySerializer,
    VenueImageSerializer,
    VenuePolicySerializer,
)


def _get_owner_venue(request, venue_id, *, require_editable=False):
    venue = get_object_or_404(Venue, id=venue_id, owner=request.user)

    if require_editable and venue.status not in Venue.EDITABLE_STATUSES:
        raise ValidationError(
            "This venue cannot be edited in its current status."
        )

    return venue


class OwnerVenueMixin:

    editable_methods = {"POST", "PUT", "PATCH", "DELETE"}

    @cached_property
    def venue(self):
        return _get_owner_venue(
            self.request,
            self.kwargs["venue_id"],
            require_editable=self.request.method in self.editable_methods,
        )


class OwnerDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def get(self, request):
        dashboard = OwnerDashboardService.get_dashboard(request.user)
        serializer = OwnerDashboardSerializer(dashboard)

        return Response(serializer.data)


class OwnerVenueListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]
    pagination_class = StandardPagination

    def get_queryset(self):
        # No status filter - unlike the public VenueListAPIView, an owner
        # must see their own DRAFT/PENDING/REJECTED venues too, not just
        # APPROVED ones.
        return (
            Venue.active_objects.filter(owner=self.request.user)
            .select_related("venue_type")
            .prefetch_related("images")
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return VenueDraftCreateSerializer

        return OwnerVenueListSerializer


class OwnerVenueDetailAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]
    serializer_class = OwnerVenueDetailSerializer
    lookup_url_kwarg = "venue_id"

    def get_queryset(self):
        return (
            Venue.active_objects.filter(owner=self.request.user)
            .select_related("venue_type")
            .prefetch_related(
                "images", "amenities", "policies__policy_type", "time_slots"
            )
        )

    def perform_destroy(self, instance):
        # Mirrors the same DRAFT/REJECTED-only rule as every other mutation
        # in this module - a PENDING venue is locked for admin review, and
        # an APPROVED (live) one isn't deletable through this draft flow.
        if instance.status not in Venue.EDITABLE_STATUSES:
            raise ValidationError(
                "This venue cannot be deleted in its current status."
            )

        instance.delete()


class VenueBasicInfoUpdateAPIView(OwnerVenueMixin, generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]
    serializer_class = VenueBasicInfoSerializer

    def get_object(self):
        return self.venue


class VenueImageListCreateAPIView(OwnerVenueMixin, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def get_queryset(self):
        return self.venue.images.all().order_by("display_order")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return VenueImageUploadSerializer

        return VenueImageSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["venue"] = self.venue

        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        images = serializer.save()

        return Response(
            VenueImageSerializer(
                images, many=True, context=self.get_serializer_context()
            ).data,
            status=status.HTTP_201_CREATED,
        )


class VenueImageDestroyAPIView(OwnerVenueMixin, generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]
    serializer_class = VenueImageSerializer
    lookup_url_kwarg = "image_id"

    def get_queryset(self):
        return self.venue.images.all()

    def perform_destroy(self, instance):
        VenueImageService.delete_image(self.venue, instance)


class VenueImageReorderAPIView(OwnerVenueMixin, APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def patch(self, request, venue_id):
        serializer = VenueImageReorderSerializer(
            data=request.data, context={"venue": self.venue}
        )
        serializer.is_valid(raise_exception=True)

        images = VenueImageService.reorder_images(
            self.venue, serializer.validated_data["ordered_image_ids"]
        )

        return Response(
            VenueImageSerializer(
                images, many=True, context={"request": request}
            ).data
        )


class VenueImageSetPrimaryAPIView(OwnerVenueMixin, APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def patch(self, request, venue_id, image_id):
        image = get_object_or_404(VenueImage, id=image_id, venue=self.venue)
        image = VenueImageService.set_primary_image(self.venue, image)

        return Response(
            VenueImageSerializer(image, context={"request": request}).data
        )


class VenueAmenitiesUpdateAPIView(OwnerVenueMixin, APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def put(self, request, venue_id):
        serializer = VenueAmenitiesUpdateSerializer(self.venue, data=request.data)
        serializer.is_valid(raise_exception=True)
        venue = serializer.save()

        return Response(AmenitySerializer(venue.amenities.all(), many=True).data)


class VenuePoliciesUpdateAPIView(OwnerVenueMixin, APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def put(self, request, venue_id):
        serializer = VenuePoliciesUpdateSerializer(self.venue, data=request.data)
        serializer.is_valid(raise_exception=True)
        venue = serializer.save()

        return Response(
            VenuePolicySerializer(
                venue.policies.select_related("policy_type"), many=True
            ).data
        )


class VenueTimeSlotListCreateAPIView(OwnerVenueMixin, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]
    serializer_class = VenueTimeSlotWriteSerializer

    def get_queryset(self):
        return self.venue.time_slots.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["venue"] = self.venue

        return context


class VenueTimeSlotDetailAPIView(
    OwnerVenueMixin, generics.RetrieveUpdateDestroyAPIView
):
    permission_classes = [IsAuthenticated, IsVenueOwner]
    serializer_class = VenueTimeSlotWriteSerializer
    lookup_url_kwarg = "slot_id"

    def get_queryset(self):
        return self.venue.time_slots.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["venue"] = self.venue

        return context


class VenueDraftProgressAPIView(OwnerVenueMixin, APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def get(self, request, venue_id):
        progress = VenueDraftService.get_progress(self.venue)

        return Response(VenueDraftProgressSerializer(progress).data)


class VenueSubmitForApprovalAPIView(OwnerVenueMixin, APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def post(self, request, venue_id):
        try:
            venue = VenueDraftService.submit_for_approval(self.venue)
        except VenueSubmissionError as exc:
            return Response(
                {"errors": exc.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            OwnerVenueDetailSerializer(venue, context={"request": request}).data
        )
