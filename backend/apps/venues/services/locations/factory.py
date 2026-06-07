from django.conf import settings

from .google import (
    GoogleLocationService,
)

from .openstreetmap import (
    OpenStreetMapLocationService,
)


def get_location_service():

    provider = getattr(
        settings,
        "LOCATION_PROVIDER",
        "OSM",
    )

    if provider == "GOOGLE":
        return GoogleLocationService()

    return OpenStreetMapLocationService()