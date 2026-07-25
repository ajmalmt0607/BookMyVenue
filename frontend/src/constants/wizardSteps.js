import {
  ClipboardList,
  Images,
  Sparkles,
  ScrollText,
  CalendarClock,
} from "lucide-react";

export const WIZARD_STEPS = [
  { key: "basic_information", label: "Basic Info", icon: ClipboardList },
  { key: "images", label: "Images", icon: Images },
  { key: "amenities", label: "Amenities", icon: Sparkles },
  { key: "policies", label: "Policies", icon: ScrollText },
  { key: "time_slots", label: "Time Slots", icon: CalendarClock },
];

export const REVIEW_STEP = "review";

export const STEP_KEYS = WIZARD_STEPS.map((step) => step.key);

export const getStepIndex = (stepKey) => STEP_KEYS.indexOf(stepKey);

export const wizardStepPath = (venueId, stepKey) =>
  `/owner/venues/${venueId}/create/${stepKey}`;
