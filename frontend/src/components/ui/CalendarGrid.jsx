import { memo, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buildMonthGrid, isSameDay } from "../../utils/calendarDate";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Pure, controlled calendar month grid — no popover/trigger/open-state of
// its own, so it can render either inside a floating panel (SingleDatePicker)
// or inline (BookingCalendar) without duplicating the grid logic.
const CalendarGrid = ({
  viewDate,
  selectedDate,
  today,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const cells = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const isPast = (date) => date < today;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="
            h-9 w-9 flex items-center justify-center rounded-full
            text-gray-500 transition-colors duration-150
            hover:bg-red-50 hover:text-red-600
          "
        >
          <ChevronLeft size={18} />
        </button>

        <span className="font-semibold text-gray-800">
          {viewDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="
            h-9 w-9 flex items-center justify-center rounded-full
            text-gray-500 transition-colors duration-150
            hover:bg-red-50 hover:text-red-600
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div role="grid" className="grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;

          const disabled = isPast(date);
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={date.toISOString()}
              type="button"
              role="gridcell"
              disabled={disabled}
              onClick={() => onSelectDate(date)}
              aria-current={isToday ? "date" : undefined}
              aria-selected={isSelected}
              className={`
                h-9 w-9 flex items-center justify-center rounded-full text-sm
                transition-all duration-150
                ${
                  disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 cursor-pointer hover:bg-red-50 hover:text-red-600"
                }
                ${isToday && !isSelected ? "border border-red-400 font-semibold" : ""}
                ${
                  isSelected
                    ? "bg-red-600 text-white font-semibold hover:bg-red-600 hover:text-white"
                    : ""
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CalendarGrid);
