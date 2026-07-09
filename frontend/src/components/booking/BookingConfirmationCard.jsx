import {
  getStatusBadgeClasses,
} from "../../utils/statusBadge";

import {
  toTitleCase,
} from "../../utils/formatText";

const InfoItem = ({
  label,
  value,
}) => {

  return (
    <div>

      <p
        className="
          text-xs
          text-gray-500
        "
      >
        {label}
      </p>

      <p
        className="
          font-semibold
          mt-1
        "
      >
        {value}
      </p>

    </div>
  );

};

const StatusItem = ({
  label,
  status,
}) => {

  return (
    <div>

      <p
        className="
          text-xs
          text-gray-500
        "
      >
        {label}
      </p>

      <span
        className={`
          inline-flex
          items-center
          mt-1
          px-3
          py-1
          rounded-full
          text-xs
          font-semibold
          border

          ${getStatusBadgeClasses(status)}
        `}
      >
        {toTitleCase(status)}
      </span>

    </div>
  );

};

const BookingConfirmationCard = ({
  booking,
}) => {

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-6
        shadow-sm
        mt-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
        "
      >
        Booking Information
      </h2>

      <div
        className="
          grid
          sm:grid-cols-2
          gap-5
          mt-6
        "
      >

        <InfoItem
          label="Booking ID"
          value={
            `#${booking.id.slice(0, 8).toUpperCase()}`
          }
        />

        <InfoItem
          label="Venue Name"
          value={booking.venue_name}
        />

        <InfoItem
          label="Venue Type"
          value={booking.venue_type}
        />

        <InfoItem
          label="Venue City"
          value={booking.venue_city}
        />

        <InfoItem
          label="Booking Date"
          value={booking.booking_date}
        />

        <StatusItem
          label="Booking Status"
          status={booking.status}
        />

        {booking.payment_status && (

          <StatusItem
            label="Payment Status"
            status={booking.payment_status}
          />

        )}

        <StatusItem
          label="Reservation Status"
          status={booking.status}
        />

      </div>
    </div>
  );

};

export default BookingConfirmationCard;
