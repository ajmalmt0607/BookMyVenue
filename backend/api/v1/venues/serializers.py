from apps.venues.models import Venue
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