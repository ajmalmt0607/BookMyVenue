import requests

from .base import BaseLocationService


class OpenStreetMapLocationService(
    BaseLocationService
):

    BASE_URL = (
        "https://nominatim.openstreetmap.org/search"
    )

    def search_locations(
        self,
        query: str,
    ):

        response = requests.get(
            self.BASE_URL,
            params={
                "q": query,
                "format": "json",
                "addressdetails": 1,
                "limit": 5,
            },
            headers={
                "User-Agent": "BookMyVenue",
            },
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        results = []

        for item in data:

            address = item.get(
                "address",
                {},
            )

            results.append(
                {
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
            )

        return results