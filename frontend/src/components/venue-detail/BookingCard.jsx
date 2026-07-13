import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";

import BookingCalendar from "./BookingCalendar";
import TimeSlotSelector from "./TimeSlotSelector";
import { getVenueAvailability, reserveBooking } from "../../services/venueService";
import { formatDateValue, startOfDay } from "../../utils/calendarDate";

const TABS = {
  DATE: "date",
  SLOTS: "slots",
};

// Fully self-contained: owns its own date/slots/selection state instead of
// having it lifted to VenueDetailPage. This keeps the booking flow's state
// changes from re-rendering the rest of the page, and keeps the rest of
// the page's state changes (lazy-mounted sections, etc.) from re-rendering
// this card.
const BookingCard = ({ venue }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TABS.SLOTS);
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateValue(startOfDay(new Date()))
  );
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchSlots = async () => {
      setSlotsLoading(true);

      try {
        const response = await getVenueAvailability(venue.slug, selectedDate);

        if (!cancelled) {
          setSlots(response?.data || []);
          setSelectedSlots([]);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setSlots([]);
        }
      } finally {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      cancelled = true;
    };
  }, [venue.slug, selectedDate]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    // Switch immediately (don't wait on the fetch) so the tab transition
    // itself feels instant; TimeSlotSelector shows its own skeleton while
    // the new date's slots load in the background.
    setActiveTab(TABS.SLOTS);
  }, []);

  const handleToggleSlot = useCallback((slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((item) => item.id === slot.id);

      return exists
        ? prev.filter((item) => item.id !== slot.id)
        : [...prev, slot];
    });
  }, []);

  const totalPrice = useMemo(
    () =>
      selectedSlots.reduce(
        (sum, slot) => sum + Number(slot.price || 0),
        0
      ),
    [selectedSlots]
  );

  const formattedDateLabel = useMemo(() => {
    const date = startOfDay(new Date(`${selectedDate}T00:00:00`));

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, [selectedDate]);

  const canProceed = selectedSlots.length > 0 && !isReserving;

  const handleContinue = useCallback(async () => {
    if (selectedSlots.length === 0) return;

    try {
      setIsReserving(true);
      setError("");

      const response = await reserveBooking({
        venue_id: venue.id,
        booking_date: selectedDate,
        slot_ids: selectedSlots.map((slot) => slot.id),
      });

      navigate(`/booking-summary/${response.booking_id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsReserving(false);
    }
  }, [navigate, selectedDate, selectedSlots, venue.id]);

  return (
    <div
      className="
        sticky top-24 overflow-hidden rounded-3xl
        border border-gray-100 bg-white shadow-lg
      "
    >
      <div className="p-6 pb-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Starting from
        </p>

        <p className="mt-1 text-3xl font-bold text-gray-900">
          ₹{Number(venue.price_per_day || 0).toLocaleString()}
          <span className="text-sm font-medium text-gray-400"> / day</span>
        </p>
      </div>

      <div className="relative mx-6 mt-6 flex rounded-2xl bg-gray-100 p-1">
        <div
          className="
            absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white
            shadow-sm transition-transform duration-200 ease-out
          "
          style={{
            transform:
              activeTab === TABS.SLOTS
                ? "translateX(calc(100% + 8px))"
                : "translateX(0)",
          }}
        />

        <button
          type="button"
          onClick={() => setActiveTab(TABS.DATE)}
          className={`
            relative z-10 flex flex-1 items-center justify-center gap-2
            rounded-xl py-2.5 text-sm font-semibold
            transition-colors duration-200 ease-out
            ${activeTab === TABS.DATE ? "text-gray-900" : "text-gray-500"}
          `}
        >
          <CalendarIcon size={15} />
          Date
        </button>

        <button
          type="button"
          onClick={() => setActiveTab(TABS.SLOTS)}
          className={`
            relative z-10 flex flex-1 items-center justify-center gap-2
            rounded-xl py-2.5 text-sm font-semibold
            transition-colors duration-200 ease-out
            ${activeTab === TABS.SLOTS ? "text-gray-900" : "text-gray-500"}
          `}
        >
          <Clock size={15} />
          Time Slots
          {slotsLoading && (
            <Loader2 size={13} className="animate-spin text-red-600" />
          )}
        </button>
      </div>

      <div className="max-h-105 overflow-y-auto p-6">
        {activeTab === TABS.DATE ? (
          <BookingCalendar value={selectedDate} onChange={handleDateChange} />
        ) : (
          <TimeSlotSelector
            slots={slots}
            selectedSlots={selectedSlots}
            onToggleSlot={handleToggleSlot}
            loading={slotsLoading}
          />
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50/60 p-6">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold text-gray-900">{formattedDateLabel}</p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">
              {selectedSlots.length} slot{selectedSlots.length === 1 ? "" : "s"}
            </p>
            <p className="text-lg font-bold text-red-600">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          disabled={!canProceed}
          onClick={handleContinue}
          className={`
            mt-4 flex w-full items-center justify-center gap-2
            rounded-2xl py-3.5 font-semibold
            transition-all duration-200 ease-out
            ${
              canProceed
                ? "bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }
          `}
        >
          {isReserving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Reserving...
            </>
          ) : (
            "Continue Booking"
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(BookingCard);
