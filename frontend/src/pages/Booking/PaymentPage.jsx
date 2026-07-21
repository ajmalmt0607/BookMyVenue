import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import PaymentCard from "../../components/booking/PaymentCard";
import PaymentElementSkeleton from "../../components/booking/PaymentElementSkeleton";
import PaymentForm from "../../components/booking/PaymentForm";
import PaymentSecurityCard from "../../components/booking/PaymentSecurityCard";
import ReservationTimer from "../../components/booking/ReservationTimer";
import BookingSummaryCard from "../../components/booking/BookingSummaryCard";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/ui/Modal";

import usePaymentIntent from "../../hooks/usePaymentIntent";
import useReservationCountdown from "../../hooks/useReservationCountdown";
import useLeaveConfirmation from "../../hooks/useLeaveConfirmation";
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

  const fetchBooking =
    useCallback(async () => {

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

    }, [bookingId]);

  useEffect(() => {

    fetchBooking();

  }, [fetchBooking]);

  useEffect(() => {

    if (!booking) return;

    // A stale/deep link to this URL for a booking that's no longer
    // RESERVED (already expired, or already paid) shouldn't render the
    // payment form at all.
    if (booking.status === "EXPIRED") {
      navigate(`/booking/${bookingId}/expired`, { replace: true });
    } else if (booking.status === "CONFIRMED") {
      navigate(`/booking/${bookingId}/confirmation`, { replace: true });
    }

  }, [booking, bookingId, navigate]);

  const shouldGuardLeaveRef = useRef(false);

  const handleExpire = useCallback(() => {

    // Force this synchronously (not via state) so the leave-guard can't
    // still see "should block" for the instant it takes React to
    // re-render - see useLeaveConfirmation for why a ref is required here.
    shouldGuardLeaveRef.current = false;

    navigate(
      `/booking/${bookingId}/expired`,
      { replace: true }
    );

  }, [navigate, bookingId]);

  const isReserved = booking?.status === "RESERVED";

  const countdown = useReservationCountdown(
    isReserved ? booking?.reserved_until : null,
    handleExpire
  );

  const shouldGuardLeave = isReserved && !countdown.isExpired;

  shouldGuardLeaveRef.current = shouldGuardLeave;

  const blocker = useLeaveConfirmation(shouldGuardLeaveRef);

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
            Confirm &amp; Pay
          </h1>

          <p
            className="
              text-gray-500
              mt-2
              mb-6
            "
          >
            Your slots are held for you while you complete payment. Once
            payment succeeds, your booking is confirmed instantly.
          </p>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-3
              mb-8
              text-xs
              text-gray-600
            "
          >

            <div
              className="
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                p-3
              "
            >
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-green-600" />
              <span>Payments are encrypted and processed securely by Stripe.</span>
            </div>

            <div
              className="
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                p-3
              "
            >
              <RefreshCcw size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
              <span>Refunds follow the venue's cancellation policy.</span>
            </div>

            <div
              className="
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                p-3
              "
            >
              <ArrowLeft size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />
              <span>Leaving this page doesn't cancel your held reservation.</span>
            </div>

          </div>

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
                isExpired={countdown.isExpired}
                onBack={() =>
                  navigate(-1)
                }
                onSuccess={() => {
                  // A successful payment is the flow completing, not the
                  // user "leaving" - don't let the leave-guard intercept
                  // our own redirect to the confirmation page.
                  shouldGuardLeaveRef.current = false;

                  navigate(
                    `/booking/${bookingId}/confirmation`
                  );
                }}
              />

            </Elements>

          ) : (

            <>

              <PaymentCard>

                <PaymentElementSkeleton />

              </PaymentCard>

              <PaymentSecurityCard />

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

        <BookingSummaryCard
          booking={booking}
          showTimer={isReserved}
          timerSlot={
            <ReservationTimer
              minutes={countdown.minutes}
              seconds={countdown.seconds}
              isExpired={countdown.isExpired}
            />
          }
        />

      </div>

      <Modal isOpen={blocker.state === "blocked"}>

        <div
          className="
            w-full
            max-w-sm
            rounded-2xl
            bg-white
            p-6
            text-center
            shadow-xl
          "
        >

          <h3
            className="
              text-lg
              font-bold
              text-gray-900
            "
          >
            Your reservation is being held
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Leaving this page may cause your reservation to expire before
            you complete payment.
          </p>

          <div
            className="
              mt-6
              flex
              gap-3
            "
          >

            <button
              type="button"
              onClick={() => blocker.reset?.()}
              className="
                flex-1
                rounded-xl
                bg-red-600
                py-2.5
                font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Stay
            </button>

            <button
              type="button"
              onClick={() => blocker.proceed?.()}
              className="
                flex-1
                rounded-xl
                border
                border-gray-200
                py-2.5
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              Leave Anyway
            </button>

          </div>

        </div>

      </Modal>

    </section>

  );

};

export default PaymentPage;
