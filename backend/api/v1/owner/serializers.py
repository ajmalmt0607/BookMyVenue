from rest_framework import serializers

from apps.venues.models import Booking


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
