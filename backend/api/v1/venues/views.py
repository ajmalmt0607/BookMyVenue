from api.v1.venues.filters import VenueFilter
from rest_framework.filters import (
    OrderingFilter,
    SearchFilter,
)
from apps.venues.models import Venue
from apps.common.pagination import StandardPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .serializers import VenueListSerializer
from rest_framework.generics import ListAPIView

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