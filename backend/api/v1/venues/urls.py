from django.urls import path

from api.v1.venues.views import LocationSearchAPIView



urlpatterns = [
    path(
        "locations/search/",
        LocationSearchAPIView.as_view(),
        name="location-search",
    ),
]