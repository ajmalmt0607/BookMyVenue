import {
  Calendar,
  Clock3,
  Building2,
  MapPin,
} from "lucide-react";

const CustomerDetailsSidebar = ({
  booking,
}) => {

  if (!booking) return null;

  return (
    <div
      className="
        sticky
        top-24
        bg-white
        border
        border-gray-100
        rounded-3xl
        shadow-sm
        h-fit
        max-h-[calc(100vh-7rem)]
        overflow-hidden
        flex
        flex-col
      "
    >

      {/* Scrollable Content */}

      <div
        className="
          overflow-y-auto
          p-6
        "
      >

        <h3
          className="
            text-xl
            font-bold
            mb-5
          "
        >
          Booking Summary
        </h3>

        {/* Venue */}

        <div
          className="
            flex
            gap-4
          "
        >

          <img
            src={
              booking.venue_primary_image
            }
            alt=""
            className="
              w-28
              h-24
              rounded-2xl
              object-cover
              flex-shrink-0
            "
          />

          <div
            className="
              flex-1
              min-w-0
            "
          >

            <h4
              className="
                text-lg
                font-bold
                leading-snug
                line-clamp-2
              "
            >
              {booking.venue_name}
            </h4>

            <div
              className="
                flex
                items-center
                gap-2
                mt-2
                text-red-600
                text-sm
              "
            >
              <MapPin size={15} />

              <span className="truncate">
                {booking.venue_city}
              </span>

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                mt-2
                text-gray-600
                text-sm
              "
            >

              <Building2 size={15} />

              <span className="truncate">
                {booking.venue_type}
              </span>

            </div>

          </div>

        </div>

        {/* Booking Details */}

        <div
          className="
            border-t
            mt-6
            pt-6
            space-y-5
          "
        >

          {/* Event Date */}

          <div
            className="
              flex
              justify-between
              items-start
              gap-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Calendar
                size={17}
                className="
                  text-gray-500
                "
              />

              <span
                className="
                  text-gray-600
                "
              >
                Event Date
              </span>

            </div>

            <span
              className="
                text-sm
                font-medium
                text-right
              "
            >
              {booking.booking_date}
            </span>

          </div>

          {/* Time Slots */}

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <Clock3
              size={17}
              className="
                mt-1
                text-gray-500
              "
            />

            <div className="flex-1">

              <p
                className="
                  text-gray-600
                  mb-3
                  text-sm
                  font-medium
                "
              >
                Selected Time Slots
              </p>

              {/* Scroll Only Here */}

              <div
                className="
                  max-h-[180px]
                  overflow-y-auto
                  space-y-3
                  pr-2
                "
              >

                {booking.slots.map(
                  (slot) => (

                    <div
                      key={slot.id}
                      className="
                        rounded-xl
                        border
                        border-gray-100
                        bg-gray-50
                        p-3
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
                            font-semibold
                            text-sm
                          "
                        >
                          {slot.slot_name}
                        </span>

                        <span
                          className="
                            text-red-600
                            font-bold
                            text-sm
                          "
                        >
                          ₹
                          {Number(
                            slot.price
                          ).toLocaleString()}
                        </span>

                      </div>

                      <p
                        className="
                          text-xs
                          text-gray-500
                          mt-1
                        "
                      >

                        {slot.start_time}
                        {" - "}
                        {slot.end_time}

                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

        {/* Price */}

        <div
          className="
            border-t
            mt-6
            pt-6
            space-y-4
          "
        >

          <div
            className="
              flex
              justify-between
              text-sm
            "
          >

            <span>
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
              text-sm
            "
          >

            <span>
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
              text-sm
            "
          >

            <span>
              GST
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

      </div>

      {/* Fixed Footer */}

      <div
        className="
          border-t
          border-gray-100
          bg-white
          p-6
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
          Total Amount
        </span>

        <span
          className="
            text-3xl
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

    </div>
  );

};

export default CustomerDetailsSidebar;