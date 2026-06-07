from rest_framework import serializers


class LocationSearchSerializer(
    serializers.Serializer
):
    query = serializers.CharField()