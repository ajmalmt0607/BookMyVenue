import { Clock3 } from "lucide-react";

// Purely presentational - the countdown itself is owned by
// useReservationCountdown (PaymentPage), the only place this is mounted.
const ReservationTimer = ({ minutes, seconds, isExpired }) => {
  return (
    <div
      className={`
        mx-6 mb-6 rounded-xl border p-4
        ${isExpired ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}
      `}
    >
      <div className="flex items-center gap-3">
        <Clock3
          size={20}
          className={isExpired ? "text-red-600" : "text-green-600"}
        />

        <div>
          <h4
            className={`font-semibold ${
              isExpired ? "text-red-700" : "text-green-700"
            }`}
          >
            {isExpired ? "Reservation Expired" : "Reservation Active"}
          </h4>

          <p className="mt-1 text-sm text-gray-600">
            {isExpired ? (
              "Your reservation has expired."
            ) : (
              <>
                Complete your payment within
                <span className="ml-1 font-bold text-red-600">
                  {minutes}:{seconds}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationTimer;
