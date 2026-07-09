const PaymentCard = ({
  children,
}) => {

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-6
        shadow-sm
      "
    >

      <h2
        className="
          text-xl
          font-bold
        "
      >
        Secure Payment
      </h2>

      <p
        className="
          text-gray-500
          mt-1
          text-sm
        "
      >
        Pay securely using Stripe.
      </p>

      {children}

    </div>
  );

};

export default PaymentCard;
