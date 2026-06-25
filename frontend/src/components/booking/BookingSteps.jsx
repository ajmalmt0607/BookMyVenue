const steps = [
  "Booking Summary",
  "Your Details",
  "Payment",
  "Confirmation",
];

const BookingSteps = ({
  currentStep,
}) => {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        mb-10
      "
    >

      {steps.map(
        (
          step,
          index
        ) => {

          const active =
            currentStep >=
            index + 1;

          return (
            <div
              key={step}
              className="
                flex-1
                flex
                items-center
              "
            >

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <div
                  className={`
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold

                    ${
                      active
                        ? "bg-red-600 text-white"
                        : "border border-gray-300 text-gray-500"
                    }
                  `}
                >
                  {index + 1}
                </div>

                <p
                  className={`
                    mt-2
                    text-xs
                    font-medium
                    text-center

                    ${
                      active
                        ? "text-red-600"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step}
                </p>

              </div>

              {index <
                steps.length - 1 && (
                <div
                  className="
                    flex-1
                    h-[2px]
                    bg-gray-200
                    mx-4
                    mb-7
                  "
                />
              )}

            </div>
          );
        }
      )}

    </div>
  );
};

export default BookingSteps;