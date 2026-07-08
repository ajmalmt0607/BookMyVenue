from apps.venues.models import Amenity, Booking, BookingSlot, Venue, VenueImage, VenueTimeSlot
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
        ]

    def get_image(self, obj):

        image = obj.images.filter(
            is_primary=True
        ).first()

        if image:
            return image.image.url

        return None
    

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
        ]


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


class ReserveBookingSerializer(serializers.Serializer):

    venue_id = serializers.UUIDField()

    booking_date = serializers.DateField()

    slot_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False,
    )


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
    

    class Meta:

        model = Booking

        fields = [
            "id",
            "full_name",
            "phone_number",
            "alternate_phone_number",
            "special_requirements",
            "venue_name",
            "venue_primary_image",
            "venue_type",
            "venue_city",
            "booking_date",
            "venue_max_capacity",
            "rating",
            "venue_amount",
            "platform_fee",
            "gst_amount",
            "total_amount",
            "reserved_until",
            "status",
            "slots",
        ]

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
    

class UpdateBookingCustomerSerializer(
    serializers.Serializer
):

    full_name = serializers.CharField(
        max_length=255
    )

    phone_number = serializers.CharField(
        max_length=20
    )

    alternate_phone_number = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
    )

    special_requirements = serializers.CharField(
        required=False,
        allow_blank=True,
    )