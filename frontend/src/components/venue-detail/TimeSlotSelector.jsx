import { memo, useMemo } from "react";
import { Check, CalendarX } from "lucide-react";

import Shimmer from "../ui/Shimmer";

const GROUP_LABELS = ["Morning", "Afternoon", "Evening"];

const groupSlots = (slots) => {
  const groups = { Morning: [], Afternoon: [], Evening: [] };

  slots.forEach((slot) => {
    const hour = Number(slot.start_time?.split(":")[0] ?? 0);

    if (hour < 12) groups.Morning.push(slot);
    else if (hour < 17) groups.Afternoon.push(slot);
    else groups.Evening.push(slot);
  });

  return GROUP_LABELS
    .map((label) => [label, groups[label]])
    .filter(([, items]) => items.length > 0);
};

const formatTime = (value) => {
  const [hourStr, minuteStr] = value.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minuteStr} ${period}`;
};

const SlotCard = ({ slot, isSelected, isDisabled, onToggle }) => (
  <button
    type="button"
    disabled={isDisabled}
    onClick={() => onToggle(slot)}
    aria-pressed={isSelected}
    className={`
      w-full rounded-2xl border p-4 text-left
      transition-colors duration-200 ease-out
      ${
        isDisabled
          ? "border-gray-100 bg-gray-50 cursor-not-allowed"
          : isSelected
            ? "border-red-600 bg-red-50"
            : "border-gray-200 hover:border-red-300"
      }
    `}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`font-semibold truncate ${
            isDisabled ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {slot.name}
        </p>

        <p
          className={`mt-1 text-sm ${
            isDisabled ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <span
          className={`font-bold ${
            isDisabled ? "text-gray-300" : "text-gray-900"
          }`}
        >
          ₹{Number(slot.price).toLocaleString()}
        </span>

        <span
          className={`
            flex h-6 w-6 items-center justify-center rounded-full border
            transition-all duration-200 ease-out
            ${
              isSelected
                ? "scale-100 border-red-600 bg-red-600 text-white opacity-100"
                : "scale-75 border-gray-300 opacity-0"
            }
          `}
        >
          <Check size={13} />
        </span>
      </div>
    </div>
  </button>
);

const SlotSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="space-y-2">
        <Shimmer className="h-4 w-24 rounded-md" />
        <Shimmer className="h-3 w-32 rounded-md" />
      </div>
      <Shimmer className="h-5 w-16 rounded-md" />
    </div>
  </div>
);

const TimeSlotSelector = ({
  slots = [],
  selectedSlots = [],
  onToggleSlot,
  loading = false,
}) => {
  const grouped = useMemo(() => groupSlots(slots), [slots]);

  const selectedIds = useMemo(
    () => new Set(selectedSlots.map((slot) => slot.id)),
    [selectedSlots]
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SlotSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-gray-400">
        <CalendarX size={26} />
        <p className="text-sm">No slots available for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([label, items]) => (
        <div key={label}>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
            {label}
          </h4>

          <div className="space-y-3">
            {items.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={selectedIds.has(slot.id)}
                isDisabled={false}
                onToggle={onToggleSlot}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(TimeSlotSelector);
