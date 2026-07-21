from apps.venues.models import (
    Amenity,
    Booking,
    BookingSlot,
    PolicyType,
    Review,
    Venue,
    VenueImage,
    VenuePolicy,
    VenueTimeSlot,
)
from apps.venues.services.media.thumbnails import get_thumbnail_url
from apps.venues.services.reviews.review_service import ReviewService
from rest_framework import serializers


class LocationSearchSerializer(
    serializers.Serializer
):
    query = serializers.CharField()


class VenueListSerializer(serializers.ModelSerializer):

    venue_type = serializers.CharField(
        source="venue_type.name"
    )

    image = serializers.SerializerMethodField()

    images = serializers.SerializerMethodField()

    class Meta:
        model = Venue

        fields = [
            "id",
            "slug",
            "name",
            "venue_type",
            "location_name",
            "city",
            "price_per_day",
            "rating",
            "min_capacity",
            "max_capacity",
            "image",
            "images",
        ]

    def _ordered_images(self, obj):
        # `obj.images.all()` reuses the view's prefetch_related cache as
        # long as no further DB-level filtering/ordering is applied to it,
        # so sort in Python instead of `.order_by(...)` to avoid an N+1.
        return sorted(
            obj.images.all(),
            key=lambda image: (
                not image.is_primary,
                image.display_order,
            ),
        )

    def _absolute_url(self, url):

        request = self.context.get("request")

        return (
            request.build_absolute_uri(url)
            if request
            else url
        )

    def get_image(self, obj):

        images = self._ordered_images(obj)

        if images and images[0].image:
            return self._absolute_url(
                get_thumbnail_url(images[0].image)
            )

        return None

    def get_images(self, obj):

        return [
            self._absolute_url(get_thumbnail_url(image.image))
            for image in self._ordered_images(obj)
            if image.image
        ]
    

class VenueImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = VenueImage

        fields = [
            "id",
            "image",
            "is_primary",
            "display_order",
        ]

    def get_image(self, obj):

        request = self.context.get("request")

        if obj.image:
            return request.build_absolute_uri(
                obj.image.url
            )

        return None
    

class AmenitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Amenity

        fields = [
            "id",
            "name",
            "icon",
        ]


class ReviewAuthorSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    full_name = serializers.SerializerMethodField()

    def get_full_name(self, obj):

        name = f"{obj.first_name} {obj.last_name}".strip()

        return name or obj.email.split("@")[0]


class ReviewSerializer(serializers.ModelSerializer):

    user = ReviewAuthorSerializer(read_only=True)

    class Meta:
        model = Review

        fields = [
            "id",
            "user",
            "rating",
            "title",
            "description",
            "is_verified_booking",
            "created_at",
        ]


class PolicyTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = PolicyType

        fields = [
            "id",
            "name",
            "icon",
            "description",
        ]


class VenuePolicySerializer(serializers.ModelSerializer):
    policy_type = PolicyTypeSerializer(read_only=True)

    class Meta:
        model = VenuePolicy

        fields = [
            "id",
            "policy_type",
            "content",
            "display_order",
        ]


class VenueTimeSlotSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = VenueTimeSlot

        fields = [
            "id",
            "name",
            "start_time",
            "end_time",
            "price",
            "max_guests",
        ]


class VenueDetailSerializer(
    serializers.ModelSerializer
):

    venue_type = serializers.CharField(
        source="venue_type.name"
    )

    images = VenueImageSerializer(
        many=True,
        read_only=True,
    )

    amenities = AmenitySerializer(
        many=True,
        read_only=True,
    )

    # `obj.policies.all()` reuses the view's Prefetch cache (already
    # filtered to is_active and ordered by display_order), so this stays
    # a single query for the whole detail request.
    policies = VenuePolicySerializer(
        many=True,
        read_only=True,
    )

    map = serializers.SerializerMethodField()

    reviews = serializers.SerializerMethodField()

    class Meta:

        model = Venue

        fields = [
            "id",
            "slug",
            "name",
            "description",

            "venue_type",

            "venue_address",

            "location_name",
            "location_address",

            "city",
            "district",
            "state",
            "country",

            "latitude",
            "longitude",

            "min_capacity",
            "max_capacity",

            "price_per_day",

            "rating",
            "total_reviews",

            "images",
            "amenities",
            "policies",
            "map",
            "reviews",
        ]

    def get_map(self, obj):
        # No runtime geocoding: coordinates are returned only if already
        # stored, otherwise the frontend gets a human-readable fallback
        # label built purely from existing address fields.
        has_coordinates = (
            obj.latitude is not None
            and obj.longitude is not None
        )

        return {
            "latitude": obj.latitude if has_coordinates else None,
            "longitude": obj.longitude if has_coordinates else None,
            "location_name": self._map_location_label(obj),
        }

    def _map_location_label(self, obj):

        parts = [
            obj.location_name,
            obj.city,
            obj.state,
        ]

        label = ", ".join(part for part in parts if part)

        return label or obj.country

    def get_reviews(self, obj):
        # One combined field (list + summary) so this only ever costs a
        # single aggregate query + a single limited select, instead of
        # two separate SerializerMethodFields each re-running the query.
        context = ReviewService.get_review_context(obj)

        return {
            "items": ReviewSerializer(
                context["reviews"],
                many=True,
                context=self.context,
            ).data,
            "average_rating": context["average_rating"],
            "total_reviews": context["total_reviews"],
            "has_more_reviews": context["has_more_reviews"],
        }


class AvailableSlotSerializer(serializers.ModelSerializer):

    class Meta:
        model = VenueTimeSlot

        fields = [
            "id",
            "name",
            "start_time",
            "end_time",
            "price",
        ]


class ConfirmBookingSerializer(serializers.Serializer):

    venue_id = serializers.UUIDField()

    booking_date = serializers.DateField()

    slot_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False,
    )

    guest_count = serializers.IntegerField(min_value=1)

    full_name = serializers.CharField(max_length=255)

    email = serializers.EmailField()

    phone_number = serializers.CharField(max_length=20)

    alternate_phone_number = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )

    special_requirements = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    arrival_notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    event_notes = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    terms_accepted = serializers.BooleanField()

    def validate_terms_accepted(self, value):

        if not value:
            raise serializers.ValidationError(
                "You must accept all terms to continue."
            )

        return value


class BookingSlotSerializer(serializers.ModelSerializer):

    slot_name = serializers.CharField(
        source="slot.name"
    )

    start_time = serializers.TimeField(
        source="slot.start_time"
    )

    end_time = serializers.TimeField(
        source="slot.end_time"
    )

    class Meta:
        model = BookingSlot

        fields = [
            "id",
            "slot_name",
            "start_time",
            "end_time",
            "price",
        ]


class BookingDetailSerializer(
    serializers.ModelSerializer
):

    venue_name = serializers.CharField(
        source="venue.name"
    )
    venue_max_capacity = serializers.CharField(
        source="venue.max_capacity"
    )
    venue_type = serializers.CharField(
        source="venue.venue_type"
    )
    rating = serializers.CharField(
        source="venue.rating"
    )
    venue_primary_image = serializers.SerializerMethodField()
    slots = BookingSlotSerializer(
        many=True,
        read_only=True,
    )
    venue_city = serializers.CharField(
        source="venue.city"
    )
    venue_slug = serializers.CharField(
        source="venue.slug"
    )

    payment_status = serializers.SerializerMethodField()

    class Meta:

        model = Booking

        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "alternate_phone_number",
            "special_requirements",
            "arrival_notes",
            "event_notes",
            "guest_count",
            "venue_name",
            "venue_primary_image",
            "venue_type",
            "venue_city",
            "venue_slug",
            "booking_date",
            "venue_max_capacity",
            "rating",
            "venue_amount",
            "platform_fee",
            "gst_amount",
            "discount_amount",
            "total_amount",
            "reserved_until",
            "status",
            "payment_status",
            "terms_accepted_at",
            "slots",
        ]

    def get_payment_status(self, obj):

        payment = getattr(
            obj,
            "payment",
            None,
        )

        return (
            payment.status
            if payment
            else None
        )

    def get_venue_primary_image(self, obj):

        image = obj.venue.images.filter(
            is_primary=True
        ).first()

        if not image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                image.image.url
            )

        return image.image.url
    

