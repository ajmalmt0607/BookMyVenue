import { CalendarClock } from "lucide-react";

import Shimmer from "../../ui/Shimmer";

import { formatCurrency, toTitleCase } from "../../../utils/formatText";
import { getStatusBadgeClasses } from "../../../utils/statusBadge";

// booking_date arrives as a bare "YYYY-MM-DD" string. `new Date(value)`
// parses that as UTC midnight, which can roll back to the previous day
// once rendered in a timezone behind UTC - build the Date from local
// year/month/day parts instead.
const formatBookingDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const BookingRowSkeleton = () => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="min-w-0 flex-1 space-y-2">
      <Shimmer className="h-4 w-1/3 rounded-md" />
      <Shimmer className="h-3 w-1/2 rounded-md" />
    </div>

    <div className="flex shrink-0 flex-col items-end gap-2">
      <Shimmer className="h-4 w-16 rounded-md" />
      <Shimmer className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

const BookingRow = ({ booking }) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="min-w-0 flex-1">
      <p className="truncate font-semibold text-gray-900">
        {booking.customer_name}
      </p>

      <p className="truncate text-sm text-gray-500">
        {booking.venue_name} &middot; {formatBookingDate(booking.booking_date)}
      </p>
    </div>

    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <p className="font-semibold text-gray-900">
        {formatCurrency(booking.total_amount)}
      </p>

      <span
        className={`
          rounded-full border px-2.5 py-0.5 text-xs font-semibold
          ${getStatusBadgeClasses(booking.status)}
        `}
      >
        {toTitleCase(booking.status)}
      </span>
    </div>
  </div>
);

const RecentBookingsCard = ({ loading, bookings }) => (
  <div className="rounded-3xl border border-gray-100 bg-white p-6">
    <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>

    {loading ? (
      <div className="mt-2 divide-y divide-gray-100">
        {[...Array(5)].map((_, index) => (
          <BookingRowSkeleton key={index} />
        ))}
      </div>
    ) : bookings.length === 0 ? (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <CalendarClock size={20} className="text-red-600" />
        </div>

        <p className="text-gray-500">No bookings yet.</p>
      </div>
    ) : (
      <div className="mt-2 divide-y divide-gray-100">
        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking} />
        ))}
      </div>
    )}
  </div>
);

export default RecentBookingsCard;
