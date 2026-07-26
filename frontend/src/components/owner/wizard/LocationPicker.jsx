import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Loader2, LocateFixed } from "lucide-react";

import LocationSearch from "../../search/LocationSearch";
import { reverseGeocode } from "../../../services/locationService";

import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const markerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = [22.9734, 78.6569]; // Geographic centre of India
const DEFAULT_ZOOM = 5;
const PICKED_ZOOM = 16;

const roundCoordinate = (value) => Math.round(value * 1e7) / 1e7;

const RecenterOnPick = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), PICKED_ZOOM));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return null;
};

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

const LocationPicker = ({ latitude, longitude, onResolve }) => {
  const [position, setPosition] = useState(
    latitude != null && longitude != null ? [latitude, longitude] : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const resolvePosition = useCallback(
    async (rawLat, rawLng) => {
      const lat = roundCoordinate(rawLat);
      const lng = roundCoordinate(rawLng);

      setPosition([lat, lng]);
      setResolving(true);
      setError("");

      try {
        const result = await reverseGeocode(lat, lng);

        onResolve({
          location_name: result.location_name || "",
          location_address: result.full_address || "",
          city: result.city || "",
          district: result.district || "",
          state: result.state || "",
          country: result.country || "",
          latitude: lat,
          longitude: lng,
        });
      } catch {
        setError(
          "Couldn't resolve an address for that spot. Try another point."
        );
      } finally {
        setResolving(false);
      }
    },
    [onResolve]
  );

  // A text search already returns the full address breakdown, so this
  // skips the extra reverse-geocode round trip that clicking/dragging on
  // the map needs (those only ever start out with bare coordinates).
  const handleSearchSelect = (location) => {
    const lat = roundCoordinate(Number(location.latitude));
    const lng = roundCoordinate(Number(location.longitude));

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    setPosition([lat, lng]);
    setError("");
    setSearchQuery("");

    onResolve({
      location_name: location.location_name || "",
      location_address: location.full_address || "",
      city: location.city || "",
      district: location.district || "",
      state: location.state || "",
      country: location.country || "",
      latitude: lat,
      longitude: lng,
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setLocating(false);
        resolvePosition(
          geoPosition.coords.latitude,
          geoPosition.coords.longitude
        );
      },
      () => {
        setLocating(false);
        setError(
          "Couldn't access your location. Allow location access or pick a point on the map."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <LocationSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSelectLocation={handleSearchSelect}
            placeholder="Search for your venue's address or area..."
          />
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="
            flex h-16 shrink-0 items-center justify-center gap-2 rounded-2xl
            border border-gray-200 bg-white px-4 text-sm font-semibold
            text-gray-700 transition-all duration-200 ease-out
            hover:border-red-300 hover:bg-red-50 hover:text-red-600
            disabled:opacity-60
          "
        >
          {locating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LocateFixed size={16} />
          )}
          Use current location
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Search above, or click the map / drag the pin to fine-tune the exact
        spot.
      </p>

      {/* `isolate` pins Leaflet's internal z-index stack (its panes and
          controls default up to z-index: 1000) to this element's own
          stacking context, so it can never render above page chrome like
          the sticky wizard step bar - only relative z-index elsewhere
          needs to out-rank this container, not Leaflet's raw values. */}
      <div className="relative isolate z-0 mt-3 overflow-hidden rounded-xl border border-gray-200">
        <MapContainer
          center={position || DEFAULT_CENTER}
          zoom={position ? PICKED_ZOOM : DEFAULT_ZOOM}
          scrollWheelZoom
          style={{ height: 320, width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onPick={resolvePosition} />
          <RecenterOnPick position={position} />

          {position && (
            <Marker
              position={position}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng();
                  resolvePosition(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="mt-2 min-h-5 text-sm">
        {resolving && (
          <span className="flex items-center gap-1.5 text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            Resolving address...
          </span>
        )}

        {!resolving && error && (
          <span className="text-red-500">{error}</span>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
