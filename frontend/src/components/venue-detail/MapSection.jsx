import { memo, useMemo } from "react";
import { ExternalLink, MapPin } from "lucide-react";

import useGeocode from "../../hooks/useGeocode";
import Shimmer from "../ui/Shimmer";

const MapSection = ({ venue }) => {
  const map = venue.map || {};
  const hasCoordinates = map.latitude != null && map.longitude != null;

  const { coordinates, loading } = useGeocode(
    map.location_name,
    !hasCoordinates && !!map.location_name
  );

  const latitude = hasCoordinates ? map.latitude : coordinates?.latitude;
  const longitude = hasCoordinates ? map.longitude : coordinates?.longitude;
  const canRenderMap = latitude != null && longitude != null;

  const mapEmbedUrl = useMemo(() => {
    if (!canRenderMap) return null;
    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  }, [canRenderMap, latitude, longitude]);

  const googleMapsUrl = canRenderMap
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        map.location_name || ""
      )}`;

  const addressLines = [
    venue.venue_address,
    [venue.city, venue.state, venue.country].filter(Boolean).join(", "),
  ].filter(Boolean);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Location</h2>

      <div className="mt-4 overflow-hidden rounded-3xl border border-gray-100">
        {canRenderMap ? (
          <iframe
            title="Venue location map"
            src={mapEmbedUrl}
            width="100%"
            height="360"
            loading="lazy"
            className="block"
          />
        ) : loading ? (
          <Shimmer className="h-[360px] w-full" />
        ) : (
          <div className="flex h-[360px] flex-col items-center justify-center gap-2 bg-gray-50 text-gray-400">
            <MapPin size={24} />
            <span className="text-sm">
              {map.location_name || "Location unavailable"}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin size={18} className="mt-0.5 shrink-0 text-red-600" />

          <div className="text-sm">
            {addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex shrink-0 items-center gap-2 rounded-xl
            border border-gray-200 px-4 py-2.5
            text-sm font-semibold text-gray-700
            transition-colors duration-200 ease-out
            hover:border-gray-300 hover:bg-gray-50
          "
        >
          Open in Google Maps
          <ExternalLink size={15} />
        </a>
      </div>
    </section>
  );
};

export default memo(MapSection);
