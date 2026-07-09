import {
  PaymentElement,
} from "@stripe/react-stripe-js";

const PaymentElementContainer = () => {

  return (
    <div
      className="
        mt-6
      "
    >

      <PaymentElement />

    </div>
  );

};

export default PaymentElementContainer;
