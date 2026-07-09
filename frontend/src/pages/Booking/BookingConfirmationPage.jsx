import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import ConfirmationHeader from "../../components/booking/ConfirmationHeader";
import BookingConfirmationCard from "../../components/booking/BookingConfirmationCard";
import CustomerInformationCard from "../../components/booking/CustomerInformationCard";
import ConfirmationActions from "../../components/booking/ConfirmationActions";
import ConfirmationSidebar from "../../components/booking/ConfirmationSidebar";
import EmptyState from "../../components/common/EmptyState";

import {
  getBookingSummary,
} from "../../services/venueService";

const BookingConfirmationPage = () => {

  const { bookingId } =
    useParams();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);

  useEffect(() => {

    fetchBooking();

  }, [bookingId]);

  const fetchBooking =
    async () => {

      try {

        setLoading(true);

        setLoadError(false);

        const response =
          await getBookingSummary(
            bookingId
          );

        setBooking(response);

      } catch (error) {

        console.error(error);

        setLoadError(true);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          py-10
        "
      >

        <div
          className="
            grid
            lg:grid-cols-[1fr_380px]
            gap-8
            items-start
          "
        >

          <div>

            <div
              className="
                h-40
                rounded-3xl
                bg-gray-100
                animate-pulse
              "
            />

            <div
              className="
                h-56
                rounded-3xl
                bg-gray-100
                animate-pulse
                mt-6
              "
            />

            <div
              className="
                h-40
                rounded-3xl
                bg-gray-100
                animate-pulse
                mt-6
              "
            />

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:justify-between
                gap-3
                mt-6
              "
            >

              <div
                className="
                  h-12
                  w-full
                  sm:w-36
                  rounded-xl
                  bg-gray-100
                  animate-pulse
                "
              />

              <div
                className="
                  h-12
                  w-full
                  sm:w-80
                  rounded-xl
                  bg-gray-100
                  animate-pulse
                "
              />

            </div>

          </div>

          <div
            className="
              h-[520px]
              rounded-3xl
              bg-gray-100
              animate-pulse
            "
          />

        </div>

      </section>

    );

  }

  if (loadError || !booking) {

    return (

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          py-10
        "
      >

        <EmptyState
          title="Unable to load booking"
          description="We couldn't fetch your booking details. Please try again."
          onRetry={fetchBooking}
        />

      </section>

    );

  }

  return (

    <section
      className="
        max-w-7xl
        mx-auto
        px-5
        py-10
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[1fr_380px]
          gap-8
          items-start
        "
      >

        {/* Left */}

        <div>

          <ConfirmationHeader />

          <BookingConfirmationCard
            booking={booking}
          />

          <CustomerInformationCard
            booking={booking}
          />

          <ConfirmationActions />

        </div>

        {/* Right */}

        <ConfirmationSidebar
          booking={booking}
        />

      </div>

    </section>

  );

};

export default BookingConfirmationPage;
