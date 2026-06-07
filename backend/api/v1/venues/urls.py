from django.urls import path

from api.v1.venues.views import LocationSearchAPIView, VenueListAPIView



urlpatterns = [
    path(
        "locations/search/",
        LocationSearchAPIView.as_view(),
        name="location-search",
    ),
    path(
        "venues/",
        VenueListAPIView.as_view(),
    ),
]