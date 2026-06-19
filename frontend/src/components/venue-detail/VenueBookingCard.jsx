import {
  useMemo,
  useState,
  useEffect,
} from "react";

const VenueBookingCard = ({
  venue,
  slots = [],
  selectedDate,
  setSelectedDate,
}) => {

  const [selectedSlots, setSelectedSlots] =
    useState([]);

  useEffect(() => {

    setSelectedSlots([]);

  }, [selectedDate]);

  const handleSlotSelect = (slot) => {

    const exists =
      selectedSlots.some(
        (item) =>
          item.id === slot.id
      );

    if (exists) {

      setSelectedSlots(
        selectedSlots.filter(
          (item) =>
            item.id !== slot.id
        )
      );

    } else {

      setSelectedSlots([
        ...selectedSlots,
        slot,
      ]);

    }

  };

  const totalPrice = useMemo(() => {

    return selectedSlots.reduce(
      (total, slot) =>
        total +
        Number(slot.price || 0),
      0
    );

  }, [selectedSlots]);

  const canProceed =
    selectedDate &&
    selectedSlots.length > 0;

  return (
    <div
      className="
        sticky
        top-24
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-6
        shadow-lg
      "
    >

      {/* Price */}

      <div>

        <h2
          className="
            text-4xl
            font-bold
            text-red-600
          "
        >
          ₹
          {Number(
            venue?.price_per_day || 0
          ).toLocaleString()}
        </h2>

        <p
          className="
            text-gray-500
            mt-1
          "
        >
          Starting Price
        </p>

      </div>

      {/* Date */}

      <div className="mt-8">

        <label
          className="
            block
            font-semibold
            mb-3
          "
        >
          Event Date
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
          className="
            w-full
            border
            border-gray-200
            rounded-xl
            p-3
            outline-none
            focus:border-red-500
          "
        />

      </div>

      {/* Slots */}

      <div className="mt-8">

        <h3
          className="
            font-semibold
            mb-4
          "
        >
          Available Time Slots
        </h3>

        <div
          className="
            max-h-[260px]
            overflow-y-auto
            space-y-3
            pr-1
          "
        >

          {slots.length > 0 ? (

            slots.map((slot) => {

              const isSelected =
                selectedSlots.some(
                  (item) =>
                    item.id === slot.id
                );

              return (

                <button
                  key={slot.id}
                  type="button"
                  onClick={() =>
                    handleSlotSelect(
                      slot
                    )
                  }
                  className={`
                    w-full
                    text-left
                    border
                    rounded-2xl
                    p-4
                    transition-all

                    ${
                      isSelected
                        ? `
                          border-red-600
                          bg-red-50
                        `
                        : `
                          border-gray-200
                          hover:border-red-300
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <h4
                      className="
                        font-semibold
                      "
                    >
                      {slot.name}
                    </h4>

                    <span
                      className="
                        text-red-600
                        font-bold
                      "
                    >
                      ₹
                      {Number(
                        slot.price || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-2
                    "
                  >
                    {slot.start_time}
                    {" - "}
                    {slot.end_time}
                  </p>

                </button>

              );

            })

          ) : (

            <div
              className="
                text-center
                py-8
                text-gray-500
              "
            >
              No slots available
            </div>

          )}

        </div>

      </div>

      {/* Summary */}

      <div
        className="
          mt-6
          border-t
          pt-5
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <div>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Selected Slots
            </p>

            <h4
              className="
                text-lg
                font-bold
              "
            >
              {selectedSlots.length}
              {" "}
              Selected
            </h4>

          </div>

          <div
            className="
              text-right
            "
          >

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Total
            </p>

            <h4
              className="
                text-2xl
                font-bold
                text-red-600
              "
            >
              ₹
              {totalPrice.toLocaleString()}
            </h4>

          </div>

        </div>

      </div>

      {/* Continue Button */}

      <button
        disabled={!canProceed}
        className={`
          w-full
          mt-6
          py-4
          rounded-xl
          font-semibold
          transition-all

          ${
            canProceed
              ? `
                bg-red-600
                text-white
                hover:bg-red-700
              `
              : `
                bg-gray-200
                text-gray-500
                cursor-not-allowed
              `
          }
        `}
      >
        Continue Booking
      </button>

    </div>
  );
};

export default VenueBookingCard;