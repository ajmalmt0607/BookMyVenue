import {
  Phone,
} from "lucide-react";
import ReservationTimer from "./ReservationTimer";

const BookingSidebar = ({
  booking,
}) => {

  if (!booking) return null;

  return (
    <div
      className="
        sticky
        top-24
        h-fit
        bg-white
        border
        border-gray-100
        rounded-2xl
        p-5
        shadow-sm
      "
    >

      <h3
        className="
          text-xl
          font-bold
          mb-5
        "
      >
        Price Details
      </h3>

      {/* Price */}

      <div
        className="
          space-y-4
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <span
            className="
              text-gray-600
            "
          >
            Venue Charges
          </span>

          <span
            className="
              font-semibold
            "
          >
            ₹
            {Number(
              booking.venue_amount
            ).toLocaleString()}
          </span>

        </div>

        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <span
            className="
              text-gray-600
            "
          >
            Platform Fee
          </span>

          <span
            className="
              font-semibold
            "
          >
            ₹
            {Number(
              booking.platform_fee
            ).toLocaleString()}
          </span>

        </div>

        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <span
            className="
              text-gray-600
            "
          >
            GST (18%)
          </span>

          <span
            className="
              font-semibold
            "
          >
            ₹
            {Number(
              booking.gst_amount
            ).toLocaleString()}
          </span>

        </div>

      </div>

      {/* Total */}

      <div
        className="
          border-t
          mt-5
          pt-5
          flex
          justify-between
          items-center
        "
      >

        <span
          className="
            text-lg
            font-bold
          "
        >
          Total
        </span>

        <span
          className="
            text-2xl
            font-bold
            text-red-600
          "
        >
          ₹
          {Number(
            booking.total_amount
          ).toLocaleString()}
        </span>

      </div>

      {/* Reservation */}

      <ReservationTimer
        reservedUntil={
            booking.reserved_until
        }
        />

      {/* Help */}

      <div
        className="
          mt-5
          pt-5
          border-t
        "
      >

        <h4
          className="
            font-semibold
            text-gray-900
          "
        >
          Need Help?
        </h4>

        <div
          className="
            mt-3
            bg-gray-50
            rounded-xl
            p-3
            flex
            items-center
            gap-3
          "
        >

          <Phone
            size={18}
          />

          <span
            className="
              font-medium
            "
          >
            +91 98765 43210
          </span>

        </div>

      </div>

    </div>
  );

};

export default BookingSidebar;