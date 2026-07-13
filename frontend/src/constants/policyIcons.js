import {
  Banknote,
  Building2,
  CalendarX,
  CigaretteOff,
  ClipboardList,
  FileText,
  Flower2,
  Home,
  ShieldCheck,
  SquareParking,
  UtensilsCrossed,
  WineOff,
} from "lucide-react";

// Explicit map (not a dynamic `import * as icons`) so only these icons end
// up in the bundle instead of the whole lucide-react set. Extend this list
// alongside any new PolicyType.icon values added in the admin. Exported as
// a plain object (not a lookup function) so callers do a direct property
// access, matching how VenueTypeDropdown/VenueCard resolve their icons.
export const POLICY_ICON_MAP = {
  "calendar-x": CalendarX,
  "clipboard-list": ClipboardList,
  home: Home,
  "shield-check": ShieldCheck,
  "building-2": Building2,
  "square-parking": SquareParking,
  "cigarette-off": CigaretteOff,
  "wine-off": WineOff,
  "utensils-crossed": UtensilsCrossed,
  "flower-2": Flower2,
  banknote: Banknote,
};

export const DEFAULT_POLICY_ICON = FileText;
