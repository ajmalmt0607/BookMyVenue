from .base import BaseLocationService


class GoogleLocationService(
    BaseLocationService
):

    def search_locations(
        self,
        query: str,
    ):
        raise NotImplementedError(
            "Google provider not implemented yet."
        )

    def reverse_geocode(
        self,
        latitude: float,
        longitude: float,
    ):
        raise NotImplementedError(
            "Google provider not implemented yet."
        )