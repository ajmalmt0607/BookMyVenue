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
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getBookingSummary,
} from "../../services/venueService";
import BookingVenueCard from "./BookingVenueCard";
import BookingSidebar from "../../components/booking/BookingSidebar";

const BookingSummaryPage = () => {

  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchBooking = async () => {

      try {

        const response =
          await getBookingSummary(
            bookingId
          );

        setBooking(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchBooking();

  }, [bookingId]);

  if (loading) {

  return (
      <div className="p-20">
        Loading...
      </div>
    );

  }

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

          <BookingVenueCard
            booking={booking}
          />

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
              onClick={() =>
                navigate(
                    `/booking/${booking.id}/details`
                )
              }
            >

              Continue

              <ArrowRight
                size={16}
              />

            </button>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <BookingSidebar
          booking={booking}
        />

      </div>

    </section>
  );
};

export default BookingSummaryPage;