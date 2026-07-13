import { useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import useClickOutside from "../../hooks/useClickOutside";
import usePopoverPosition from "../../hooks/usePopoverPosition";
import PopoverPortal from "../ui/PopoverPortal";
import CalendarGrid from "../ui/CalendarGrid";
import { formatDateValue, startOfDay } from "../../utils/calendarDate";

const formatDisplay = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

  const goToPrevMonth = () =>
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const selectDate = (date) => {
    if (!date || date < today) return;
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
          <CalendarGrid
            viewDate={viewDate}
            selectedDate={selectedDate}
            today={today}
            onSelectDate={selectDate}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
          />
        </div>
      </PopoverPortal>
    </div>
  );
};

export default SingleDatePicker;
