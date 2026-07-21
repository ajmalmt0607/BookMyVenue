import {
  useEffect,
  useState,
} from "react";

import {
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";

import PaymentCard from "./PaymentCard";
import PaymentElementContainer from "./PaymentElementContainer";
import PaymentSecurityCard from "./PaymentSecurityCard";

import {
  confirmPaymentStatus,
} from "../../services/venueService";

const PaymentForm = ({
  booking,
  bookingId,
  isExpired,
  onBack,
  onSuccess,
}) => {

  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const finalizePayment = async () => {

    try {

      // Confirm synchronously instead of relying solely on the
      // Stripe webhook, which may be delayed or not configured
      // (e.g. `stripe listen` not running in local dev).
      await confirmPaymentStatus(
        bookingId
      );

    } catch (err) {

      console.error(err);

    } finally {

      onSuccess();

    }

  };

  useEffect(() => {

    if (!stripe) return;

    const params =
      new URLSearchParams(
        window.location.search
      );

    const redirectSecret = params.get(
      "payment_intent_client_secret"
    );

    if (!redirectSecret) return;

    stripe
      .retrievePaymentIntent(
        redirectSecret
      )
      .then(({ paymentIntent }) => {

        if (
          paymentIntent?.status ===
          "succeeded"
        ) {

          finalizePayment();

        } else if (paymentIntent) {

          setErrorMessage(
            "Payment was not completed. Please try again."
          );

        }

      });

  }, [stripe]);

  const handlePay = async () => {

    if (!stripe || !elements) return;

    setProcessing(true);

    setErrorMessage("");

    const { error: submitError } =
      await elements.submit();

    if (submitError) {

      setErrorMessage(
        submitError.message ||
        "Please check your payment details."
      );

      setProcessing(false);

      return;

    }

    const { error, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            `${window.location.origin}/booking/${bookingId}/confirmation`,
        },
        redirect: "if_required",
      });

    if (error) {

      setErrorMessage(
        error.message ||
        "Payment failed. Please try again."
      );

      setProcessing(false);

      return;

    }

    if (
      paymentIntent?.status === "succeeded" ||
      paymentIntent?.status === "processing"
    ) {

      await finalizePayment();

      return;

    }

    setErrorMessage(
      "Payment could not be completed. Please try again."
    );

    setProcessing(false);

  };

  return (

    <>

      <PaymentCard>

        <PaymentElementContainer />

      </PaymentCard>

      <PaymentSecurityCard />

      {errorMessage && (

        <p
          className="
            text-red-500
            text-sm
            mt-4
          "
        >
          {errorMessage}
        </p>

      )}

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
          onClick={onBack}
          disabled={processing}
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
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >

          <ArrowLeft
            size={16}
          />

          Back

        </button>

        <button
          type="button"
          onClick={handlePay}
          disabled={
            processing ||
            isExpired ||
            !stripe ||
            !elements
          }
          className={`
            px-6
            py-3
            rounded-xl
            font-semibold
            flex
            items-center
            gap-2
            transition-all

            ${
              processing || isExpired
                ? `
                  bg-gray-300
                  text-gray-600
                  cursor-not-allowed
                `
                : `
                  bg-red-600
                  hover:bg-red-700
                  text-white
                `
            }
          `}
        >

          {processing ? (

            <>

              <Loader2
                size={16}
                className="
                  animate-spin
                "
              />

              Processing Payment...

            </>

          ) : (

            <>

              Pay ₹
              {Number(
                booking.total_amount
              ).toLocaleString()}

              <Lock
                size={16}
              />

            </>

          )}

        </button>

      </div>

    </>

  );

};

export default PaymentForm;
