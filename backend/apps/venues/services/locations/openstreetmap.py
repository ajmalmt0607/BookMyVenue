import requests

from .base import BaseLocationService


class OpenStreetMapLocationService(
    BaseLocationService
):

    SEARCH_URL = (
        "https://nominatim.openstreetmap.org/search"
    )

    REVERSE_URL = (
        "https://nominatim.openstreetmap.org/reverse"
    )

    HEADERS = {
        "User-Agent": "BookMyVenue",
    }

    def search_locations(
        self,
        query: str,
    ):

        response = requests.get(
            self.SEARCH_URL,
            params={
                "q": query,
                "format": "json",
                "addressdetails": 1,
                "limit": 5,
            },
            headers=self.HEADERS,
            timeout=10,
        )

        response.raise_for_status()

        return [
            self._format_result(item)
            for item in response.json()
        ]

    def reverse_geocode(
        self,
        latitude: float,
        longitude: float,
    ):

        response = requests.get(
            self.REVERSE_URL,
            params={
                "lat": latitude,
                "lon": longitude,
                "format": "jsonv2",
                "addressdetails": 1,
            },
            headers=self.HEADERS,
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        if data.get("error"):
            return None

        return self._format_result(data)

    def _format_result(self, item):

        address = item.get(
            "address",
            {},
        )

        return {
            "location_name": (
                address.get("city")
                or address.get("town")
                or address.get("village")
                or item.get("display_name")
            ),
            "full_address": item.get(
                "display_name"
            ),
            "city": (
                address.get("city")
                or address.get("town")
                or address.get("village")
            ),
            "district": (
                address.get("state_district")
            ),
            "state": address.get(
                "state"
            ),
            "country": address.get(
                "country"
            ),
            "latitude": item.get("lat"),
            "longitude": item.get("lon"),
        }
