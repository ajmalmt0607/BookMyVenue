import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Mail,
  Loader2,
} from "lucide-react";

import Modal from "../ui/Modal";
import OtpInput from "../ui/OtpInput";

import {
  verifySignupOtp,
} from "../../services/authService";

import {
  setTokens,
} from "../../utils/tokenStorage";

import {
  loginSuccess,
} from "../../features/auth/authSlice";

import { ROUTES } from "../../constants/routes";

const OtpVerificationModal = ({
  isOpen,
  email,
  onClose,
}) => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const dispatch =
    useDispatch();

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleVerify =
    async () => {
      if (
        otp.length !== 6
      ) {
        setError(
          "Please enter a valid OTP"
        );

        return;
      }

      try {
        setLoading(true);

        setError("");

        const response =
          await verifySignupOtp({
            email,
            otp,
          });

        setTokens(
          response.tokens
        );

        dispatch(
          loginSuccess({
            accessToken:
              response.tokens
                .access,

            refreshToken:
              response.tokens
                .refresh,

            user: response.user,
          })
        );

        onClose();

        navigate(
          location.state?.from
            ?.pathname ||
            ROUTES.HOME,
          { replace: true }
        );

      } catch (error) {
        const apiError =
          error?.response?.data;

        setError(
          apiError?.message ||
            apiError?.detail ||
            "Invalid OTP"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Modal
      isOpen={isOpen}
    >
      <div
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-md
          p-8
          shadow-2xl
        "
      >
        <div
          className="
            h-16
            w-16
            mx-auto
            rounded-full
            bg-red-50
            flex
            items-center
            justify-center
          "
        >
          <Mail
            size={28}
            className="
              text-red-600
            "
          />
        </div>

        <h2
          className="
            text-2xl
            font-bold
            text-center
            mt-5
          "
        >
          Verify Your Email
        </h2>

        <p
          className="
            text-center
            text-gray-500
            mt-2
            text-sm
          "
        >
          Enter the OTP sent to
        </p>

        <p
          className="
            text-center
            font-semibold
            mt-1
            mb-6
          "
        >
          {email}
        </p>

        <OtpInput
          otp={otp}
          setOtp={setOtp}
        />

        {error && (
          <p
            className="
              text-red-500
              text-sm
              text-center
              mt-4
            "
          >
            {error}
          </p>
        )}

        <button
          onClick={
            handleVerify
          }
          disabled={loading}
          className="
            w-full
            h-12
            mt-6
            bg-red-600
            hover:bg-red-700
            text-white
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="
                  animate-spin
                "
              />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default OtpVerificationModal;