import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;
let loadedKey = null;

export const getStripe = (
  publishableKey
) => {

  if (!publishableKey) return null;

  if (!stripePromise || loadedKey !== publishableKey) {

    stripePromise = loadStripe(
      publishableKey
    );

    loadedKey = publishableKey;

  }

  return stripePromise;

};
