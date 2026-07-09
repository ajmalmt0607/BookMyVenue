import {
  ShieldCheck,
} from "lucide-react";

const PaymentSecurityCard = () => {

  return (
    <div
      className="
        mt-5
        bg-blue-50
        border
        border-blue-100
        rounded-2xl
        p-4
        flex
        items-start
        gap-3
      "
    >

      <ShieldCheck
        size={20}
        className="
          text-blue-600
          mt-0.5
          flex-shrink-0
        "
      />

      <div>

        <h4
          className="
            font-semibold
            text-blue-900
          "
        >
          Secure Payment
        </h4>

        <p
          className="
            text-sm
            text-blue-700
            mt-1
          "
        >
          Payments are securely processed by Stripe.
          Your payment information never reaches our servers.
        </p>

      </div>

    </div>
  );

};

export default PaymentSecurityCard;
