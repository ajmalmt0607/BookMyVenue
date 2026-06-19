const VenueTimeSlots = ({
  slots,
}) => {

  return (
    <section className="mt-12">

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        Available Time Slots
      </h2>

      <div
        className="
          grid
          md:grid-cols-3
          gap-5
        "
      >

        {slots.map((slot) => (

          <div
            key={slot.id}
            className="
              border
              rounded-2xl
              p-5
            "
          >

            <h3
              className="
                font-semibold
                text-lg
              "
            >
              {slot.name}
            </h3>

            <p
              className="
                text-gray-500
                mt-2
              "
            >
              {slot.start_time}
              {" - "}
              {slot.end_time}
            </p>

            <p
              className="
                text-red-600
                font-bold
                text-xl
                mt-4
              "
            >
              ₹
              {Number(
                slot.price
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
};

export default VenueTimeSlots;