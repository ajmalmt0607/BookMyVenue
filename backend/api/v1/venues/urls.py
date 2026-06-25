from django.urls import path

from api.v1.venues.views import BookingDetailAPIView, LocationSearchAPIView, ReserveBookingAPIView, ValidateReservationAPIView, VenueAvailabilityAPIView, VenueDetailAPIView, VenueListAPIView



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
    path(
        "venues/<slug:slug>/",
        VenueDetailAPIView.as_view(),
        name="venue-detail",
    ),
    path(
        "<slug:slug>/availability/",
        VenueAvailabilityAPIView.as_view(),
        name="venue-availability",
    ),
    path(
        "bookings/reserve/",
        ReserveBookingAPIView.as_view(),
    ),

    path(
        "bookings/<uuid:pk>/",
        BookingDetailAPIView.as_view(),
    ),

    path(
        "bookings/<uuid:pk>/validate/",
        ValidateReservationAPIView.as_view(),
    ),
]