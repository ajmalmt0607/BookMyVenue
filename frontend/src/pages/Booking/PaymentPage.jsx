import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Elements,
} from "@stripe/react-stripe-js";

import {
  ArrowLeft,
} from "lucide-react";

import PaymentCard from "../../components/booking/PaymentCard";
import PaymentElementSkeleton from "../../components/booking/PaymentElementSkeleton";
import PaymentForm from "../../components/booking/PaymentForm";
import PaymentSecurityCard from "../../components/booking/PaymentSecurityCard";
import ReservationTimer from "../../components/booking/ReservationTimer";
import CustomerDetailsSidebar from "../../components/booking/CustomerDetailsSidebar";
import EmptyState from "../../components/common/EmptyState";

import usePaymentIntent from "../../hooks/usePaymentIntent";
import { getStripe } from "../../utils/stripe";

import {
  getBookingSummary,
} from "../../services/venueService";

const stripeAppearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#dc2626",
    borderRadius: "12px",
    fontFamily: "inherit",
  },
};

const PaymentPage = () => {

  const navigate =
    useNavigate();

  const { bookingId } =
    useParams();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);

  const {
    clientSecret,
    publishableKey,
    loading: intentLoading,
    error: intentError,
    retry: retryIntent,
  } = usePaymentIntent(bookingId);

  const stripePromise = useMemo(

    () =>
      getStripe(
        publishableKey
      ),

    [publishableKey]

  );

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
                h-9
                w-40
                rounded-lg
                bg-gray-100
                animate-pulse
              "
            />

            <div
              className="
                h-5
                w-96
                max-w-full
                rounded-lg
                bg-gray-100
                animate-pulse
                mt-3
                mb-8
              "
            />

            <div
              className="
                h-64
                rounded-3xl
                bg-gray-100
                animate-pulse
              "
            />

            <div
              className="
                h-20
                rounded-2xl
                bg-gray-100
                animate-pulse
                mt-5
              "
            />

            <div
              className="
                h-20
                rounded-xl
                bg-gray-100
                animate-pulse
                mt-5
              "
            />

            <div
              className="
                flex
                justify-between
                mt-6
                gap-4
              "
            >

              <div
                className="
                  h-12
                  w-28
                  rounded-xl
                  bg-gray-100
                  animate-pulse
                "
              />

              <div
                className="
                  h-12
                  w-40
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

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Payment
          </h1>

          <p
            className="
              text-gray-500
              mt-2
              mb-8
            "
          >
            Complete your secure payment
            to confirm your booking.
          </p>

          {intentError ? (

            <EmptyState
              title="Unable to start payment"
              description="We couldn't initiate your payment. Please try again."
              onRetry={retryIntent}
            />

          ) : clientSecret && stripePromise ? (

            <Elements
              key={clientSecret}
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: stripeAppearance,
              }}
            >

              <PaymentForm
                booking={booking}
                bookingId={bookingId}
                onBack={() =>
                  navigate(-1)
                }
                onSuccess={() =>
                  navigate(
                    `/booking/${bookingId}/confirmation`
                  )
                }
              />

            </Elements>

          ) : (

            <>

              <PaymentCard>

                <PaymentElementSkeleton />

              </PaymentCard>

              <PaymentSecurityCard />

              <ReservationTimer
                reservedUntil={
                  booking.reserved_until
                }
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
                  type="button"
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
                    transition
                  "
                >

                  <ArrowLeft
                    size={16}
                  />

                  Back

                </button>

                <button
                  type="button"
                  disabled
                  className="
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    flex
                    items-center
                    gap-2
                    bg-gray-300
                    text-gray-600
                    cursor-not-allowed
                  "
                >
                  {intentLoading
                    ? "Preparing payment..."
                    : "Unable to load payment"}
                </button>

              </div>

            </>

          )}

        </div>

        {/* Right */}

        <CustomerDetailsSidebar
          booking={booking}
        />

      </div>

    </section>

  );

};

export default PaymentPage;
