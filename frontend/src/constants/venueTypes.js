import {
  Building2,
  Heart,
  Landmark,
  LayoutGrid,
  Palmtree,
  PartyPopper,
  Presentation,
} from "lucide-react";

// Explicit map (not a dynamic `import * as icons`) so only these icons end
// up in the bundle instead of the whole lucide-react set. Extend this list
// alongside any new VenueType.icon values added in the admin. Keys match
// the free-text `icon` value stored on VenueType records.
export const VENUE_TYPE_ICON_MAP = {
  "party-popper": PartyPopper,
  heart: Heart,
  presentation: Presentation,
  landmark: Landmark,
  palmtree: Palmtree,
};

export const DEFAULT_VENUE_TYPE_ICON = Building2;

export const ALL_VENUE_TYPES_ICON = LayoutGrid;
