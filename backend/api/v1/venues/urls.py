from django.urls import path

from api.v1.venues.views import (
    AmenityListAPIView,
    BookingDetailAPIView,
    BookingQuoteAPIView,
    CancelBookingAPIView,
    ConfirmBookingAPIView,
    ConfirmPaymentAPIView,
    InitiatePaymentAPIView,
    LocationSearchAPIView,
    PolicyTypeListAPIView,
    StripeWebhookAPIView,
    VenueAvailabilityAPIView,
    VenueDetailAPIView,
    VenueListAPIView,
    VenueReviewListAPIView,
    VenueTypeListAPIView,
)


urlpatterns = [
    path(
        "locations/search/",
        LocationSearchAPIView.as_view(),
        name="location-search",
    ),
    path(
        "venue-types/",
        VenueTypeListAPIView.as_view(),
        name="venue-type-list",
    ),
    path(
        "amenities/",
        AmenityListAPIView.as_view(),
        name="amenity-list",
    ),
    path(
        "policy-types/",
        PolicyTypeListAPIView.as_view(),
        name="policy-type-list",
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
        "<slug:slug>/reviews/",
        VenueReviewListAPIView.as_view(),
        name="venue-reviews",
    ),
    path(
        "bookings/quote/",
        BookingQuoteAPIView.as_view(),
    ),

    path(
        "bookings/confirm/",
        ConfirmBookingAPIView.as_view(),
    ),

    path(
        "bookings/<uuid:pk>/",
        BookingDetailAPIView.as_view(),
    ),

    path(
        "bookings/<uuid:pk>/cancel/",
        CancelBookingAPIView.as_view(),
    ),

    path(
        "bookings/<uuid:pk>/payment/intent/",
        InitiatePaymentAPIView.as_view(),
    ),

    path(
        "bookings/<uuid:pk>/payment/confirm/",
        ConfirmPaymentAPIView.as_view(),
    ),

    path(
        "payments/webhook/stripe/",
        StripeWebhookAPIView.as_view(),
    ),
]