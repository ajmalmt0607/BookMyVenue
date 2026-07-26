import { useEffect, useState } from "react";

import { getVenueTypes } from "../services/venueService";
import {
  ALL_VENUE_TYPES_ICON,
  DEFAULT_VENUE_TYPE_ICON,
  VENUE_TYPE_ICON_MAP,
} from "../constants/venueTypes";

const ALL_VENUE_TYPES_OPTION = {
  value: "",
  label: "All Venues",
  icon: ALL_VENUE_TYPES_ICON,
};

// Filtering by venue type must key off the VenueType model (slug), not a
// hardcoded label list, so admins can add/rename/deactivate types without
// the search bar and filters going stale or mismatching backend slugs.
const useVenueTypes = () => {
  const [options, setOptions] = useState([ALL_VENUE_TYPES_OPTION]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getVenueTypes()
      .then((venueTypes) => {
        if (!isMounted) return;

        const mapped = venueTypes.map((venueType) => ({
          value: venueType.slug,
          label: venueType.name,
          icon: VENUE_TYPE_ICON_MAP[venueType.icon] || DEFAULT_VENUE_TYPE_ICON,
        }));

        setOptions([ALL_VENUE_TYPES_OPTION, ...mapped]);
      })
      .catch(() => {
        if (isMounted) setOptions([ALL_VENUE_TYPES_OPTION]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { options, loading };
};

export default useVenueTypes;
