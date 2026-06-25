import {
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import BookingSteps
from "../../components/booking/BookingSteps";

const BookingSummaryPage = () => {

  const navigate =
    useNavigate();

  /*
    Later replace this with:

    const booking =
      useSelector(
        state => state.booking
      );

    or API data
  */

  const booking = {
    venueName:
      "Skyline Event Center",

    city:
      "Kozhikode, Kerala",

    venueType:
      "Auditorium",

    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",

    guests: 500,

    date:
      "17 June 2026",

    slots: [
      {
        id: 1,
        name: "Morning",
        time:
          "09:00 AM - 12:00 PM",
        price: 10000,
      },

      {
        id: 2,
        name: "Afternoon",
        time:
          "12:00 PM - 03:00 PM",
        price: 10000,
      },

      {
        id: 3,
        name: "Night",
        time:
          "08:00 PM - 11:00 PM",
        price: 14000,
      },
    ],
  };

  const venueCharge =
    booking.slots.reduce(
      (
        total,
        slot
      ) =>
        total + slot.price,
      0
    );

  const platformFee =
    500;

  const gst =
    Math.round(
      (
        venueCharge +
        platformFee
      ) * 0.18
    );

  const totalAmount =
    venueCharge +
    platformFee +
    gst;

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-5
        py-8
      "
    >

      {/* <BookingSteps
        currentStep={1}
      /> */}

      <div
        className="
          grid
          lg:grid-cols-[1fr_330px]
          gap-8
        "
      >

        {/* LEFT */}

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >
            Booking Summary
          </h1>

          <p
            className="
              text-gray-500
              mt-2
              mb-6
            "
          >
            Review your booking
            details before
            proceeding.
          </p>

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
                src={
                  booking.image
                }
                alt=""
                className="
                  w-full
                  md:w-64
                  h-40
                  object-cover
                  rounded-2xl
                "
              />

              <div
                className="
                  flex-1
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                  "
                >
                  {
                    booking.venueName
                  }
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

                  <MapPin
                    size={16}
                  />

                  <span>
                    {
                      booking.city
                    }
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

                  <Building2
                    size={16}
                  />

                  <span
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {
                      booking.venueType
                    }
                  </span>

                </div>

              </div>

            </div>

            {/* Details Section */}

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

              {/* Left Info */}

              <div
                className="
                  space-y-4
                "
              >

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
                    className="
                      text-red-600
                    "
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

                    <h4
                      className="
                        font-semibold
                      "
                    >
                      {
                        booking.date
                      }
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
                    className="
                      text-red-600
                    "
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

                    <h4
                      className="
                        font-semibold
                      "
                    >
                      {
                        booking.guests
                      }
                    </h4>

                  </div>

                </div>

              </div>

              {/* Slots */}

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
                        key={
                          slot.id
                        }
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
                            {
                              slot.name
                            }
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

                            <Clock
                              size={13}
                            />

                            {
                              slot.time
                            }

                          </p>

                        </div>

                        <div
                          className="
                            font-bold
                            text-red-600
                          "
                        >
                          ₹
                          {slot.price.toLocaleString()}
                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* Buttons */}

          <div
            className="
              flex
              justify-between
              mt-6
            "
          >

            <button
              onClick={() =>
                navigate(-1)
              }
              className="
                border
                border-gray-200
                px-5
                py-3
                rounded-xl
                flex
                items-center
                gap-2
                hover:bg-gray-50
              "
            >

              <ArrowLeft
                size={16}
              />

              Back

            </button>

            <button
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                flex
                items-center
                gap-2
              "
            >

              Continue

              <ArrowRight
                size={16}
              />

            </button>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

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

          <div
            className="
              space-y-4
            "
          >

            <div
              className="
                flex
                justify-between
              "
            >
              <span>
                Venue Charges
              </span>

              <span>
                ₹
                {venueCharge.toLocaleString()}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>
                Platform Fee
              </span>

              <span>
                ₹500
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>
                GST (18%)
              </span>

              <span>
                ₹
                {gst.toLocaleString()}
              </span>
            </div>

          </div>

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
                font-bold
                text-lg
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
              {totalAmount.toLocaleString()}
            </span>

          </div>

          <div
            className="
              mt-5
              bg-green-50
              border
              border-green-200
              rounded-xl
              p-3
              text-sm
            "
          >
            Great choice! This venue
            is available for your
            selected date and slots.
          </div>

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

              +91 98765 43210

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default BookingSummaryPage;