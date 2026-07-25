from decimal import Decimal

from rest_framework import serializers

from apps.venues.models import Amenity, Booking, PolicyType, Venue, VenueTimeSlot, VenueType
from apps.venues.services.owner.venue_draft_service import VenueDraftService
from apps.venues.services.owner.venue_image_service import VenueImageService
from apps.venues.services.owner.venue_time_slot_service import VenueTimeSlotService

from api.v1.venues.serializers import (
    AmenitySerializer,
    VenueImageSerializer,
    VenueListSerializer,
    VenuePolicySerializer,
    VenueTimeSlotSerializer,
)


class OwnerDashboardStatsSerializer(serializers.Serializer):
    total_venues = serializers.IntegerField()
    monthly_bookings = serializers.IntegerField()
    monthly_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    pending_bookings = serializers.IntegerField()


class OwnerRecentBookingSerializer(serializers.ModelSerializer):
    venue_name = serializers.CharField(source="venue.name")
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "venue_name",
            "customer_name",
            "booking_date",
            "status",
            "total_amount",
            "created_at",
        ]

    def get_customer_name(self, obj):
        name = f"{obj.customer.first_name} {obj.customer.last_name}".strip()

        return name or obj.customer.email.split("@")[0]


class OwnerDashboardSerializer(serializers.Serializer):
    has_venues = serializers.BooleanField()
    stats = OwnerDashboardStatsSerializer(allow_null=True)
    recent_bookings = OwnerRecentBookingSerializer(many=True)


class OwnerVenueListSerializer(VenueListSerializer):
    """Same shape as the public venue list, plus the moderation fields an
    owner needs to see (status, is_active) that customers never see."""

    venue_type = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()

    class Meta(VenueListSerializer.Meta):
        fields = VenueListSerializer.Meta.fields + [
            "status",
            "is_active",
            "updated_at",
            "completion_percentage",
        ]

    def get_venue_type(self, obj):
        return obj.venue_type.name if obj.venue_type_id else None

    def get_completion_percentage(self, obj):
        # Only meaningful for the one draft an owner can have at a time -
        # skip the extra queries entirely for every other status.
        if obj.status != Venue.Status.DRAFT:
            return None

        return VenueDraftService.get_progress(obj)["completion_percentage"]


class VenueDraftCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Venue
        fields = ["id", "slug", "status", "created_at"]
        read_only_fields = fields

    def create(self, validated_data):
        owner = self.context["request"].user

        return VenueDraftService.create_draft(owner)


class OwnerVenueDetailSerializer(serializers.ModelSerializer):

    venue_type = serializers.SerializerMethodField()
    venue_type_id = serializers.PrimaryKeyRelatedField(
        source="venue_type", read_only=True
    )
    images = VenueImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    policies = VenuePolicySerializer(many=True, read_only=True)
    time_slots = VenueTimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Venue
        fields = [
            "id",
            "slug",
            "status",
            "venue_type",
            "venue_type_id",
            "name",
            "description",
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
            "images",
            "amenities",
            "policies",
            "time_slots",
            "created_at",
            "updated_at",
        ]

    def get_venue_type(self, obj):
        return obj.venue_type.name if obj.venue_type_id else None


class VenueBasicInfoSerializer(serializers.ModelSerializer):

    venue_type_id = serializers.PrimaryKeyRelatedField(
        source="venue_type",
        queryset=VenueType.objects.filter(is_active=True),
        required=False,
    )
    price_per_day = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("0.01"), required=False
    )

    class Meta:
        model = Venue
        fields = [
            "venue_type_id",
            "name",
            "description",
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
        ]

    def validate(self, attrs):
        min_capacity = attrs.get(
            "min_capacity", getattr(self.instance, "min_capacity", None)
        )
        max_capacity = attrs.get(
            "max_capacity", getattr(self.instance, "max_capacity", None)
        )

        if (
            min_capacity is not None
            and max_capacity is not None
            and min_capacity > max_capacity
        ):
            raise serializers.ValidationError(
                {"min_capacity": "min_capacity cannot be greater than max_capacity."}
            )

        return attrs

    def update(self, instance, validated_data):
        return VenueDraftService.update_basic_information(instance, **validated_data)


class VenueImageUploadSerializer(serializers.Serializer):

    images = serializers.ListField(
        child=serializers.ImageField(), allow_empty=False
    )

    def create(self, validated_data):
        return VenueImageService.add_images(
            self.context["venue"], validated_data["images"]
        )


class VenueImageReorderSerializer(serializers.Serializer):
    ordered_image_ids = serializers.ListField(
        child=serializers.UUIDField(), allow_empty=False
    )

    def validate_ordered_image_ids(self, value):
        value = [str(image_id) for image_id in value]
        existing_ids = set(
            str(image_id)
            for image_id in self.context["venue"].images.values_list("id", flat=True)
        )

        if set(value) != existing_ids:
            raise serializers.ValidationError(
                "Must include exactly the venue's current image ids, no more, no less."
            )

        return value


class VenueAmenitiesUpdateSerializer(serializers.Serializer):

    amenity_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.filter(is_active=True), many=True
    )

    def update(self, instance, validated_data):
        return VenueDraftService.update_amenities(
            instance, validated_data["amenity_ids"]
        )


class VenuePolicyInputSerializer(serializers.Serializer):
    policy_type_id = serializers.PrimaryKeyRelatedField(
        source="policy_type",
        queryset=PolicyType.objects.filter(is_active=True),
    )
    content = serializers.CharField()
    display_order = serializers.IntegerField(default=1, min_value=1)


class VenuePoliciesUpdateSerializer(serializers.Serializer):

    policies = VenuePolicyInputSerializer(many=True)

    def validate_policies(self, value):
        policy_type_ids = [item["policy_type"].id for item in value]

        if len(policy_type_ids) != len(set(policy_type_ids)):
            raise serializers.ValidationError(
                "Duplicate policy types are not allowed."
            )

        return value

    def update(self, instance, validated_data):
        return VenueDraftService.update_policies(
            instance, validated_data["policies"]
        )


class VenueTimeSlotWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = VenueTimeSlot
        fields = [
            "id",
            "name",
            "start_time",
            "end_time",
            "price",
            "max_guests",
            "is_active",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        start_time = attrs.get(
            "start_time", getattr(self.instance, "start_time", None)
        )
        end_time = attrs.get("end_time", getattr(self.instance, "end_time", None))
        is_active = attrs.get(
            "is_active", getattr(self.instance, "is_active", True)
        )

        if start_time is not None and end_time is not None and start_time >= end_time:
            raise serializers.ValidationError(
                {"end_time": "end_time must be after start_time."}
            )

        venue = self.context["venue"]

        if is_active and VenueTimeSlotService.overlaps_existing(
            venue,
            start_time,
            end_time,
            exclude_id=self.instance.id if self.instance else None,
        ):
            raise serializers.ValidationError(
                "This time slot overlaps with an existing active time slot."
            )

        return attrs

    def create(self, validated_data):
        return VenueTimeSlot.objects.create(
            venue=self.context["venue"], **validated_data
        )


class VenueDraftProgressSerializer(serializers.Serializer):
    current_step = serializers.IntegerField()
    completed_steps = serializers.ListField(child=serializers.CharField())
    next_step = serializers.CharField()
    completion_percentage = serializers.IntegerField()
