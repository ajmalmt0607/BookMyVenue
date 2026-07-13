import { useEffect, useState } from "react";

import { searchLocations } from "../services/locationService";

const CACHE_PREFIX = "bmv_geocode:";

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (key, value) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore storage errors (private mode, quota, etc.) — worst case we
    // just re-geocode next time instead of failing the map.
  }
};

// Geocodes a free-text location string only when needed (no coordinates
// stored on the venue), and caches the resolved lat/lng in localStorage
// keyed by that string so the same address is never re-geocoded.
const useGeocode = (query, enabled) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !query) return undefined;

    const cached = readCache(query);

    if (cached) {
      setCoordinates(cached);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    searchLocations(query)
      .then((results) => {
        const first = results?.[0];
        if (!first || cancelled) return;

        const resolved = {
          latitude: Number(first.latitude),
          longitude: Number(first.longitude),
        };

        if (!Number.isNaN(resolved.latitude) && !Number.isNaN(resolved.longitude)) {
          writeCache(query, resolved);
          setCoordinates(resolved);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, enabled]);

  return { coordinates, loading };
};

export default useGeocode;
