import { memo, useMemo, useState } from "react";

import CalendarGrid from "../ui/CalendarGrid";
import { formatDateValue, startOfDay } from "../../utils/calendarDate";

// Inline (non-popover) use of the same CalendarGrid the home-search
// SingleDatePicker renders inside its floating panel — no duplicated
// calendar logic between the two.
const BookingCalendar = ({ value, onChange }) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const selectedDate = value ? startOfDay(new Date(`${value}T00:00:00`)) : null;

  const [viewDate, setViewDate] = useState(selectedDate || today);

  const goToPrevMonth = () =>
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const selectDate = (date) => {
    if (!date || date < today) return;
    onChange(formatDateValue(date));
  };

  return (
    <CalendarGrid
      viewDate={viewDate}
      selectedDate={selectedDate}
      today={today}
      onSelectDate={selectDate}
      onPrevMonth={goToPrevMonth}
      onNextMonth={goToNextMonth}
    />
  );
};

export default memo(BookingCalendar);
