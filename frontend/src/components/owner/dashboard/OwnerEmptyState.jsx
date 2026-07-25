import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../constants/routes";

// Shared by the Dashboard's empty state (default behavior: go to Venue
// Management) and Venue Management's own empty state (onAction overridden
// to create a draft and jump straight into the wizard) - same visual,
// different call to action, so the markup isn't duplicated across pages.
const OwnerEmptyState = ({
  onAction,
  actionLabel = "List Your First Venue",
  actionLoading = false,
}) => {
  const navigate = useNavigate();

  const handleClick = onAction || (() => navigate(ROUTES.OWNER_VENUES));

  return (
    <div
      className="
        flex flex-col items-center gap-4
        rounded-3xl border border-gray-100 bg-white
        px-6 py-20 text-center
      "
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <Building2 size={28} className="text-red-600" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900">
          You haven't listed any venues yet
        </h3>

        <p className="mt-2 max-w-sm text-gray-500">
          Create your first venue and start receiving bookings from
          customers.
        </p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={actionLoading}
        className="
          mt-2 rounded-xl bg-red-600 px-6 py-2.5
          text-sm font-semibold text-white
          transition-all duration-200 ease-out
          hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
          disabled:opacity-60
        "
      >
        {actionLoading ? "Creating..." : actionLabel}
      </button>
    </div>
  );
};

export default OwnerEmptyState;
