import { useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import useClickOutside from "../../hooks/useClickOutside";
import usePopoverPosition from "../../hooks/usePopoverPosition";
import PopoverPortal from "../ui/PopoverPortal";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplay = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const isSameDay = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildMonthGrid = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
};

const SingleDatePicker = ({ value, onChange, placeholder = "Add event date" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const selectedDate = value ? startOfDay(new Date(`${value}T00:00:00`)) : null;

  const [viewDate, setViewDate] = useState(selectedDate || today);
  const [wasOpen, setWasOpen] = useState(isOpen);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useClickOutside([containerRef, panelRef], () => setIsOpen(false));

  const position = usePopoverPosition(containerRef, isOpen);

  // Jump the visible month back to the selection whenever the panel opens.
  // Done during render (rather than an effect) so it lands before the open paint.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      setViewDate(selectedDate || today);
    }
  }

  const cells = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const goToPrevMonth = () =>
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const isPast = (date) => date < today;

  const selectDate = (date) => {
    if (!date || isPast(date)) return;
    onChange(formatDateValue(date));
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (!isOpen && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handlePanelKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`
          w-full h-16 flex items-center gap-3 px-4
          border rounded-2xl bg-white text-left cursor-pointer
          transition-all duration-200 ease-out
          hover:border-red-300 hover:shadow-sm
          focus:outline-none focus:ring-4 focus:ring-red-100
          ${isOpen ? "border-red-500 ring-4 ring-red-100" : "border-gray-200"}
        `}
      >
        <CalendarIcon size={18} className="text-red-600 shrink-0" />

        <span
          className={`flex-1 truncate font-medium ${
            selectedDate ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {selectedDate ? formatDisplay(selectedDate) : placeholder}
        </span>
      </button>

      <PopoverPortal position={position} panelRef={panelRef} className="z-9999">
        <div
          role="dialog"
          aria-label="Choose event date"
          onKeyDown={handlePanelKeyDown}
          className={`
            w-[320px] max-w-[calc(100vw-2.5rem)]
            bg-white rounded-2xl shadow-xl border border-gray-100 p-4
            origin-top transition-all duration-200 ease-out
            ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPrevMonth}
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
              onClick={goToNextMonth}
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
                  onClick={() => selectDate(date)}
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
      </PopoverPortal>
    </div>
  );
};

export default SingleDatePicker;
