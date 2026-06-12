from django.contrib import admin

from .models import (
    Amenity,
    Booking,
    Venue,
    VenueImage,
    VenueTimeSlot,
    VenueType,
)


class VenueImageInline(admin.TabularInline):
    model = VenueImage
    extra = 1


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


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "venue",
        "customer",
        "booking_date",
        "guests",
        "total_amount",
        "status",
    )

    list_filter = (
        "status",
        "booking_date",
    )

    search_fields = (
        "venue__name",
        "customer__email",
    )

    autocomplete_fields = (
        "venue",
        "customer",
    )