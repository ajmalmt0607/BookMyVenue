import {
  CheckCircle2,
} from "lucide-react";

const ConfirmationHeader = () => {

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-8
        shadow-sm
        text-center
      "
    >

      <div className="flex items-center justify-center gap-4">
          <div
            className="
              w-16
              h-16
              rounded-full
              bg-green-50
              flex
              items-center
              justify-center
            "
          >

            <CheckCircle2
              size={36}
              className="
                text-green-600
              "
            />

          </div>
          <h1
          className="
            text-3xl
            font-bold
          "
        >
          Booking Confirmed!
          </h1>
      </div>

      <p
        className="
          text-gray-500
          mt-2
        "
      >
        Your payment was successful and
        your venue has been booked successfully.
      </p>

    </div>
  );

};

export default ConfirmationHeader;
