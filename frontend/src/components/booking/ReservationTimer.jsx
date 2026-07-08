import {
  useEffect,
  useState,
} from "react";

import {
  Clock3,
} from "lucide-react";

const ReservationTimer = ({
  reservedUntil,
}) => {

  const getRemainingTime =
    () => {

      const now =
        new Date().getTime();

      const expiry =
        new Date(
          reservedUntil
        ).getTime();

      const difference =
        expiry - now;

      if (difference <= 0) {

        return {
          expired: true,
          minutes: "00",
          seconds: "00",
        };

      }

      const minutes =
        Math.floor(
          difference / 1000 / 60
        );

      const seconds =
        Math.floor(
          (difference / 1000) % 60
        );

      return {

        expired: false,

        minutes: String(
          minutes
        ).padStart(
          2,
          "0"
        ),

        seconds: String(
          seconds
        ).padStart(
          2,
          "0"
        ),

      };

    };

  const [time, setTime] =
    useState(
      getRemainingTime()
    );

  useEffect(() => {

    const interval =
      setInterval(() => {

        setTime(
          getRemainingTime()
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [reservedUntil]);

  return (

    <div
      className={`
        mt-5
        rounded-xl
        p-4
        border

        ${
          time.expired
            ? `
              border-red-200
              bg-red-50
            `
            : `
              border-green-200
              bg-green-50
            `
        }
      `}
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <Clock3
          size={20}
          className={`
            ${
              time.expired
                ? "text-red-600"
                : "text-green-600"
            }
          `}
        />

        <div>

          <h4
            className={`
              font-semibold

              ${
                time.expired
                  ? "text-red-700"
                  : "text-green-700"
              }
            `}
          >
            {
              time.expired
                ? "Reservation Expired"
                : "Reservation Active"
            }
          </h4>

          <p
            className="
              text-sm
              text-gray-600
              mt-1
            "
          >

            {
              time.expired
                ? (
                  "Your reservation has expired."
                )
                : (
                  <>
                    Complete your booking
                    within

                    <span
                      className="
                        font-bold
                        text-red-600
                        ml-1
                      "
                    >
                      {time.minutes}
                      :
                      {time.seconds}
                    </span>
                  </>
                )
            }

          </p>

        </div>

      </div>

    </div>

  );

};

export default ReservationTimer;