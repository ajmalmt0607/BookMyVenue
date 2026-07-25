import { Check } from "lucide-react";

const SavedIndicator = ({ show }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 text-sm font-medium text-green-600
      transition-opacity duration-300
      ${show ? "opacity-100" : "opacity-0"}
    `}
  >
    <Check size={16} />
    Saved
  </span>
);

export default SavedIndicator;
