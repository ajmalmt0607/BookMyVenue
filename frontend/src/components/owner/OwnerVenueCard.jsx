import { Building2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  toTitleCase,
  formatCurrency,
  formatRelativeTime,
} from "../../utils/formatText";
import { getStatusBadgeClasses } from "../../utils/statusBadge";
import { wizardStepPath } from "../../constants/wizardSteps";

const WIZARD_EDITABLE_STATUSES = ["DRAFT", "PENDING", "APPROVED", "REJECTED"];

const DraftCard = ({ venue, onDelete, deleting }) => {
  const navigate = useNavigate();
  const percentage = venue.completion_percentage ?? 0;

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span
            className={`
              rounded-full border px-2.5 py-1 text-xs font-semibold
              ${getStatusBadgeClasses(venue.status)}
            `}
          >
            Draft
          </span>

          <span className="text-sm font-bold text-red-600">
            {percentage}% Complete
          </span>
        </div>

        <h3 className="mt-4 line-clamp-1 text-lg font-bold text-gray-900">
          {venue.name || "Untitled Draft"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Last updated {formatRelativeTime(venue.updated_at)}
        </p>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-red-600 transition-[width] duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(wizardStepPath(venue.id, "basic_information"))
          }
          className="
            flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold
            text-white transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
          "
        >
          Continue Setup
        </button>

        <button
          type="button"
          onClick={() => onDelete(venue)}
          disabled={deleting}
          aria-label="Delete draft"
          className="
            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
            border border-gray-200 text-gray-500
            transition-colors duration-200
            hover:border-red-200 hover:bg-red-50 hover:text-red-600
            disabled:opacity-60
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const OwnerVenueCard = ({ venue, onDelete, deleting }) => {
  const navigate = useNavigate();

  if (venue.status === "DRAFT") {
    return <DraftCard venue={venue} onDelete={onDelete} deleting={deleting} />;
  }

  const isClickable = WIZARD_EDITABLE_STATUSES.includes(venue.status);
  const needsFix = venue.status === "REJECTED";

  const handleClick = () => {
    if (isClickable) {
      navigate(wizardStepPath(venue.id, "basic_information"));
    }
  };

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`
        flex flex-col overflow-hidden rounded-3xl border border-gray-100
        bg-white transition-[box-shadow,border-color] duration-200 ease-out
        ${isClickable ? "cursor-pointer hover:border-gray-200 hover:shadow-lg" : ""}
      `}
    >
      <div className="relative h-44 w-full bg-gray-100">
        {venue.image ? (
          <img
            src={venue.image}
            alt={venue.name || "Untitled venue"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 size={32} className="text-gray-300" />
          </div>
        )}

        <span
          className={`
            absolute left-3 top-3 rounded-full border px-2.5 py-1
            text-xs font-semibold ${getStatusBadgeClasses(venue.status)}
          `}
        >
          {toTitleCase(venue.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
          {venue.name || "Untitled Draft"}
        </h3>

        {venue.city && (
          <p className="mt-1 text-sm text-gray-500">{venue.city}</p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-900">
            {venue.price_per_day
              ? `Starting from ${formatCurrency(venue.price_per_day)}`
              : "Price not set"}
          </p>

          {needsFix && (
            <span className="text-xs font-semibold text-red-600">
              Fix &amp; resubmit
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerVenueCard;
