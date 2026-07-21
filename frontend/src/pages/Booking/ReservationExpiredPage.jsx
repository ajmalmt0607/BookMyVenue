import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock3 } from "lucide-react";

import Button from "../../components/ui/Button";
import { getBookingSummary } from "../../services/venueService";

const ReservationExpiredPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [venueSlug, setVenueSlug] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getBookingSummary(bookingId)
      .then((booking) => {
        if (!cancelled) setVenueSlug(booking.venue_slug || null);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <Clock3 size={28} className="text-red-600" />
      </div>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Your reservation has expired
      </h1>

      <p className="mt-3 text-gray-500">
        The 10-minute hold on your selected slots ran out before payment was
        completed, so they've been released back for other guests to book.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={() =>
            navigate(venueSlug ? `/venues/${venueSlug}` : "/venues")
          }
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Try Booking Again
        </Button>

        <Button
          type="button"
          onClick={() => navigate("/venues")}
          className="border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Browse Other Venues
        </Button>
      </div>
    </section>
  );
};

export default ReservationExpiredPage;
