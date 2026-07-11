from django.contrib import admin

from .models import (
    Amenity,
    Booking,
    Payment,
    PolicyType,
    Review,
    Venue,
    VenueImage,
    VenuePolicy,
    VenueTimeSlot,
    VenueType,
)


class VenueImageInline(admin.TabularInline):
    model = VenueImage
    extra = 1


class VenuePolicyInline(admin.TabularInline):
    model = VenuePolicy
    extra = 0
    fields = (
        "policy_type",
        "content",
        "display_order",
        "is_active",
    )
    autocomplete_fields = (
        "policy_type",
    )
    ordering = (
        "display_order",
    )


@admin.register(VenueType)
class VenueTypeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
    )

    list_filter = (
        "is_active",
    )

    prepopulated_fields = {}
    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
    )

    list_filter = (
        "is_active",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "venue_type",
        "city",
        "price_per_day",
        "max_capacity",
        "status",
        "is_featured",
        "is_active",
    )

    search_fields = (
        "name",
        "city",
        "location_name",
    )

    list_filter = (
        "status",
        "venue_type",
        "is_featured",
        "is_active",
        "city",
    )

    filter_horizontal = (
        "amenities",
    )

    readonly_fields = (
        "id",
        "slug",
        "rating",
        "total_reviews",
        "created_at",
        "updated_at",
    )

    inlines = [
        VenueImageInline,
        VenuePolicyInline,
    ]

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "owner",
                    "venue_type",
                    "name",
                    "description",
                    "status",
                )
            },
        ),
        (
            "Location",
            {
                "fields": (
                    "location_address",
                    "venue_address",
                    "city",
                    "district",
                    "state",
                    "country",
                    "latitude",
                    "longitude",
                )
            },
        ),
        (
            "Capacity & Pricing",
            {
                "fields": (
                    "min_capacity",
                    "max_capacity",
                    "price_per_day",
                )
            },
        ),
        (
            "Amenities",
            {
                "fields": (
                    "amenities",
                )
            },
        ),
        (
            "Platform Controls",
            {
                "fields": (
                    "is_featured",
                    "is_active",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "id",
                    "slug",
                    "rating",
                    "total_reviews",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )


@admin.register(VenueImage)
class VenueImageAdmin(admin.ModelAdmin):
    list_display = (
        "venue",
        "is_primary",
        "created_at",
        "display_order"
    )

    list_filter = (
        "is_primary",
    )

    search_fields = (
        "venue__name",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )


@admin.register(VenueTimeSlot)
class VenueTimeSlotAdmin(admin.ModelAdmin):

    list_display = (
        "venue",
        "name",
        "start_time",
        "end_time",
        "price",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "venue__name",
        "name",
    )


from django.contrib import admin

from apps.venues.models import Booking
from apps.venues.models import BookingSlot


class BookingSlotInline(admin.TabularInline):
    model = BookingSlot
    extra = 0
    readonly_fields = (
        "slot",
        "price",
    )


class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0
    can_delete = False

    readonly_fields = (
        "id",
        "amount",
        "payment_provider",
        "stripe_payment_intent_id",
        "stripe_charge_id",
        "status",
        "created_at",
        "updated_at",
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "venue",
        "customer",
        "booking_date",
        "total_amount",
        "status",
        "reserved_until",
        "created_at",
    )

    list_filter = (
        "status",
        "booking_date",
        "created_at",
    )

    search_fields = (
        "venue__name",
        "customer__email",
    )

    autocomplete_fields = (
        "venue",
        "customer",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    inlines = [
        BookingSlotInline,
        PaymentInline,
    ]

    ordering = (
        "-created_at",
    )


@admin.register(BookingSlot)
class BookingSlotAdmin(admin.ModelAdmin):

    list_display = (
        "booking",
        "slot",
        "price",
    )

    search_fields = (
        "booking__venue__name",
        "slot__name",
    )

    autocomplete_fields = (
        "booking",
        "slot",
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "booking",
        "amount",
        "payment_provider",
        "status",
        "stripe_payment_intent_id",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_provider",
        "created_at",
    )

    search_fields = (
        "booking__venue__name",
        "booking__customer__email",
        "stripe_payment_intent_id",
        "stripe_charge_id",
    )

    autocomplete_fields = (
        "booking",
    )

    readonly_fields = (
        "id",
        "stripe_payment_intent_id",
        "stripe_charge_id",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):

    list_display = (
        "venue",
        "user",
        "rating",
        "is_verified_booking",
        "is_active",
        "created_at",
    )

    list_filter = (
        "rating",
        "is_verified_booking",
        "is_active",
        "created_at",
    )

    search_fields = (
        "venue__name",
        "user__email",
        "title",
    )

    autocomplete_fields = (
        "venue",
        "user",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )


@admin.register(PolicyType)
class PolicyTypeAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "icon",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )


@admin.register(VenuePolicy)
class VenuePolicyAdmin(admin.ModelAdmin):

    list_display = (
        "venue",
        "policy_type",
        "display_order",
        "is_active",
        "created_at",
    )

    list_editable = (
        "display_order",
        "is_active",
    )

    list_filter = (
        "policy_type",
        "is_active",
    )

    search_fields = (
        "venue__name",
        "policy_type__name",
    )

    autocomplete_fields = (
        "venue",
        "policy_type",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    ordering = (
        "venue",
        "display_order",
    )