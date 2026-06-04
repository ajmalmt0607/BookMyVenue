import {
  useRef,
  useEffect,
} from "react";

const OtpInput = ({
  otp,
  setOtp,
}) => {
  const inputRefs =
    useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (
    value,
    index
  ) => {
    if (
      !/^\d?$/.test(value)
    ) {
      return;
    }

    const otpArray = [
      ...otp.padEnd(
        6,
        " "
      ),
    ];

    otpArray[index] =
      value;

    const newOtp =
      otpArray
        .join("")
        .trim();

    setOtp(newOtp);

    if (
      value &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    e,
    index
  ) => {
    if (
      e.key ===
        "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  const handlePaste = (
    e
  ) => {
    e.preventDefault();

    const pastedData =
      e.clipboardData
        .getData("text")
        .trim();

    if (
      !/^\d+$/.test(
        pastedData
      )
    ) {
      return;
    }

    const otpValue =
      pastedData.slice(
        0,
        6
      );

    setOtp(otpValue);

    const lastIndex =
      Math.min(
        otpValue.length -
          1,
        5
      );

    inputRefs.current[
      lastIndex
    ]?.focus();
  };

  return (
    <div
      className="
        flex
        justify-center
        gap-3
      "
    >
      {[...Array(6)].map(
        (_, index) => (
          <input
            key={index}
            ref={(el) =>
              (inputRefs.current[
                index
              ] = el)
            }
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={
              otp[index] || ""
            }
            onChange={(e) =>
              handleChange(
                e.target.value,
                index
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(
                e,
                index
              )
            }
            onPaste={
              handlePaste
            }
            className="
              h-12
              w-12
              rounded-xl
              border
              border-gray-200
              text-center
              text-lg
              font-semibold
              focus:border-red-600
              focus:outline-none
              transition-all
            "
          />
        )
      )}
    </div>
  );
};

export default OtpInput;