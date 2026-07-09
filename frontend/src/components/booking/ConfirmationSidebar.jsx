import {
  CheckCircle2,
} from "lucide-react";

import CustomerDetailsSidebar from "./CustomerDetailsSidebar";

const ConfirmationSidebar = ({
  booking,
}) => {

  return (
    <CustomerDetailsSidebar
      booking={booking}
      badge={

        <span
          className="
            inline-flex
            items-center
            gap-1.5
            bg-green-50
            text-green-700
            border
            border-green-200
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            whitespace-nowrap
          "
        >

          <CheckCircle2
            size={14}
          />

          Booking Confirmed

        </span>

      }
      footerNote={

        <div
          className="
            border-t
            border-gray-100
            bg-green-50
            p-4
            flex
            items-center
            gap-3
          "
        >

          <CheckCircle2
            size={20}
            className="
              text-green-600
              flex-shrink-0
            "
          />

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-green-700
              "
            >
              Your booking has been confirmed.
            </p>

            <p
              className="
                text-xs
                text-gray-600
                mt-0.5
              "
            >
              No payment is pending.
            </p>

          </div>

        </div>

      }
    />
  );

};

export default ConfirmationSidebar;
