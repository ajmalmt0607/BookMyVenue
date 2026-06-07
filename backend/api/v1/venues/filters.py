from django.db.models import Q

import django_filters

from apps.venues.models import Venue


class VenueFilter(django_filters.FilterSet):

    location = django_filters.CharFilter(
        method="filter_location"
    )

    guests = django_filters.NumberFilter(
        method="filter_guests"
    )

    venue_type = django_filters.CharFilter(
        field_name="venue_type__slug"
    )

    class Meta:
        model = Venue
        fields = []

    def filter_location(
        self,
        queryset,
        name,
        value,
    ):
        return queryset.filter(
            Q(city__icontains=value)
            | Q(district__icontains=value)
            | Q(state__icontains=value)
            | Q(location_name__icontains=value)
        )

    def filter_guests(
        self,
        queryset,
        name,
        value,
    ):
        return queryset.filter(
            max_capacity__gte=value
        )