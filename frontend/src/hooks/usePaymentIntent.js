import {
  useEffect,
  useState,
} from "react";

import {
  initiatePayment,
} from "../services/venueService";

const usePaymentIntent = (
  bookingId
) => {

  const [clientSecret, setClientSecret] =
    useState(null);

  const [publishableKey, setPublishableKey] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {

    fetchPaymentIntent();

  }, [bookingId]);

  const fetchPaymentIntent =
    async () => {

      try {

        setLoading(true);

        setError(false);

        const response =
          await initiatePayment(
            bookingId
          );

        setClientSecret(
          response.client_secret
        );

        setPublishableKey(
          response.publishable_key
        );

      } catch (err) {

        console.error(err);

        setError(true);

      } finally {

        setLoading(false);

      }

    };

  return {
    clientSecret,
    publishableKey,
    loading,
    error,
    retry: fetchPaymentIntent,
  };

};

export default usePaymentIntent;
