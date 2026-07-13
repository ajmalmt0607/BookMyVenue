import {
  Accessibility,
  Building2,
  Music,
  ShieldCheck,
  Sparkles,
  SquareParking,
  UtensilsCrossed,
} from "lucide-react";

// The backend Amenity model doesn't have a category field yet, so amenities
// are grouped client-side by keyword match. Swap this for a real
// `amenity.category` once the backend adds one — the AmenityGroup
// component's contract (an array of {key,label,icon,items}) stays the same.
const AMENITY_CATEGORIES = [
  {
    key: "facilities",
    label: "Venue Facilities",
    icon: Building2,
    keywords: [
      "wifi",
      "power",
      "backup",
      "air condition",
      " ac",
      "reception",
      "furniture",
      "lighting",
      "sound system",
      "generator",
      "restroom",
      "washroom",
    ],
  },
  {
    key: "food",
    label: "Food & Catering",
    icon: UtensilsCrossed,
    keywords: ["kitchen", "catering", "food", "bar", "beverage", "dining"],
  },
  {
    key: "entertainment",
    label: "Entertainment",
    icon: Music,
    keywords: ["stage", "dj", "music", "dance", "projector", "screen"],
  },
  {
    key: "parking",
    label: "Parking",
    icon: SquareParking,
    keywords: ["parking", "valet"],
  },
  {
    key: "accessibility",
    label: "Accessibility",
    icon: Accessibility,
    keywords: ["wheelchair", "accessible", "ramp", "elevator", "lift"],
  },
  {
    key: "security",
    label: "Security",
    icon: ShieldCheck,
    keywords: ["security", "cctv", "guard", "camera", "safety"],
  },
];

const OTHER_CATEGORY = {
  key: "other",
  label: "Other Amenities",
  icon: Sparkles,
};

export const categorizeAmenities = (amenities = []) => {
  const buckets = new Map();

  amenities.forEach((amenity) => {
    const nameLower = ` ${amenity.name.toLowerCase()} `;

    const matched =
      AMENITY_CATEGORIES.find((category) =>
        category.keywords.some((keyword) => nameLower.includes(keyword))
      ) || OTHER_CATEGORY;

    if (!buckets.has(matched.key)) {
      buckets.set(matched.key, { ...matched, items: [] });
    }

    buckets.get(matched.key).items.push(amenity);
  });

  const orderedKeys = [
    ...AMENITY_CATEGORIES.map((category) => category.key),
    OTHER_CATEGORY.key,
  ];

  return orderedKeys.map((key) => buckets.get(key)).filter(Boolean);
};
