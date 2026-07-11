import {
  LayoutGrid,
  PartyPopper,
  Heart,
  Presentation,
  Landmark,
  Palmtree,
} from "lucide-react";

export const VENUE_TYPE_OPTIONS = [
  { value: "", label: "All Venues", icon: LayoutGrid },
  { value: "banquet-hall", label: "Banquet Hall", icon: PartyPopper },
  { value: "wedding-hall", label: "Wedding Hall", icon: Heart },
  { value: "conference-room", label: "Conference Room", icon: Presentation },
  { value: "auditorium", label: "Auditorium", icon: Landmark },
  { value: "resort", label: "Resort", icon: Palmtree },
];
