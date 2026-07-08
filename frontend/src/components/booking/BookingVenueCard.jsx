import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Building2,
} from "lucide-react";

const BookingVenueCard = ({
  booking,
}) => {

  if (!booking) return null;

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        p-5
        shadow-sm
      "
    >

      {/* Venue Header */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-5
        "
      >

        <img
          src={booking.venue_primary_image}
          alt={booking.venue_name}
          className="
            w-full
            md:w-64
            h-40
            object-cover
            rounded-2xl
          "
        />

        <div className="flex-1">

          <h2
            className="
              text-2xl
              font-bold
              text-gray-900
            "
          >
            {booking.venue_name}
          </h2>

          <div
            className="
              flex
              items-center
              gap-2
              mt-2
              text-red-600
            "
          >

            <MapPin size={16} />

            <span>
              {booking.venue_city}
            </span>

          </div>

          <div
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              bg-gray-50
              px-3
              py-2
              rounded-xl
            "
          >

            <Building2 size={16} />

            <span
              className="
                text-sm
                font-medium
              "
            >
              {booking.venue_type}
            </span>

          </div>

        </div>

      </div>

      {/* Details */}

      <div
        className="
          mt-6
          pt-6
          border-t
          grid
          lg:grid-cols-[280px_1fr]
          gap-5
        "
      >

        {/* Left */}

        <div className="space-y-4">

          <div
            className="
              bg-gray-50
              rounded-xl
              p-3
              flex
              gap-3
              items-center
            "
          >

            <Calendar
              size={18}
              className="text-red-600"
            />

            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Event Date
              </p>

              <h4 className="font-semibold">
                {booking.booking_date}
              </h4>

            </div>

          </div>

          <div
            className="
              bg-gray-50
              rounded-xl
              p-3
              flex
              gap-3
              items-center
            "
          >

            <Users
              size={18}
              className="text-red-600"
            />

            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Guests
              </p>

              <h4 className="font-semibold">
                {booking.venue_max_capacity}
              </h4>

            </div>

          </div>

        </div>

        {/* Selected Slots */}

        <div>

          <h3
            className="
              font-bold
              text-lg
              mb-3
            "
          >
            Selected Time Slots
          </h3>

          <div
            className="
              max-h-[220px]
              overflow-y-auto
              space-y-3
            "
          >

            {booking.slots.map(
              (slot) => (

                <div
                  key={slot.id}
                  className="
                    border
                    border-gray-200
                    rounded-xl
                    p-3
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <h4
                      className="
                        font-semibold
                        text-sm
                      "
                    >
                      {slot.slot_name}
                    </h4>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                        flex
                        items-center
                        gap-1
                      "
                    >

                      <Clock size={13} />

                      {slot.start_time}
                      {" - "}
                      {slot.end_time}

                    </p>

                  </div>

                  <div
                    className="
                      font-bold
                      text-red-600
                    "
                  >
                    ₹
                    {Number(
                      slot.price
                    ).toLocaleString()}
                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );

};

export default BookingVenueCard;