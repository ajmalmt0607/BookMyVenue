const PaymentElementSkeleton = () => {

  return (
    <div
      className="
        mt-6
        space-y-3
      "
    >

      <div
        className="
          h-12
          rounded-xl
          bg-gray-100
          animate-pulse
        "
      />

      <div
        className="
          h-12
          rounded-xl
          bg-gray-100
          animate-pulse
        "
      />

      <div
        className="
          h-12
          w-1/2
          rounded-xl
          bg-gray-100
          animate-pulse
        "
      />

    </div>
  );

};

export default PaymentElementSkeleton;
