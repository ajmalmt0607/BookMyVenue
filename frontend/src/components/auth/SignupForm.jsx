import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";

import OtpVerificationModal from "./OtpVerificationModal";

import { signupSchema } from "../../validations/authValidation";
import { signupUser } from "../../services/authService";

const SignupForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [
    showOtpModal,
    setShowOtpModal,
  ] = useState(false);

  const [
    signupEmail,
    setSignupEmail,
  ] = useState("");

  const [formData, setFormData] =
    useState({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
    });

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setErrors({});

    const validation =
      signupSchema.safeParse(
        formData
      );

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach(
        (issue) => {
          fieldErrors[
            issue.path[0]
          ] = issue.message;
        }
      );

      setErrors(fieldErrors);

      return;
    }

    try {
      setLoading(true);

      await signupUser(
        formData
      );

      setSignupEmail(
        formData.email
      );

      setShowOtpModal(true);

    } catch (error) {
      const apiError =
        error?.response?.data;

      setErrors({
        api:
          apiError?.message ||
          apiError?.detail ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="
          bg-white
          rounded-[32px]
          shadow-xl
          border
          border-gray-100
          p-8
          lg:p-10
        "
      >
        <h2
          className="
            text-4xl
            font-bold
            tracking-tight
          "
        >
          Sign Up
        </h2>

        <p
          className="
            text-gray-500
            mt-2
            mb-8
          "
        >
          Create your account to get
          started
        </p>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          <div
            className="
              grid
              md:grid-cols-2
              gap-4
            "
          >
            <div>
              <InputField
                icon={
                  <User
                    size={18}
                  />
                }
                name="first_name"
                value={
                  formData.first_name
                }
                onChange={
                  handleChange
                }
                placeholder="First Name"
              />

              {errors.first_name && (
                <p
                  className="
                    text-red-500
                    text-sm
                    mt-1
                  "
                >
                  {
                    errors.first_name
                  }
                </p>
              )}
            </div>

            <div>
              <InputField
                icon={
                  <User
                    size={18}
                  />
                }
                name="last_name"
                value={
                  formData.last_name
                }
                onChange={
                  handleChange
                }
                placeholder="Last Name"
              />

              {errors.last_name && (
                <p
                  className="
                    text-red-500
                    text-sm
                    mt-1
                  "
                >
                  {
                    errors.last_name
                  }
                </p>
              )}
            </div>
          </div>

          <div>
            <InputField
              icon={
                <Mail
                  size={18}
                />
              }
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Email Address"
            />

            {errors.email && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <InputField
              icon={
                <Phone
                  size={18}
                />
              }
              name="phone_number"
              value={
                formData.phone_number
              }
              onChange={
                handleChange
              }
              placeholder="Phone Number"
            />

            {errors.phone_number && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {
                  errors.phone_number
                }
              </p>
            )}
          </div>

          <div>
            <PasswordField
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Create Password"
            />

            {errors.password && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {
                  errors.password
                }
              </p>
            )}
          </div>

          <div>
            <PasswordField
              name="confirm_password"
              value={
                formData.confirm_password
              }
              onChange={
                handleChange
              }
              placeholder="Confirm Password"
            />

            {errors.confirm_password && (
              <p
                className="
                  text-red-500
                  text-sm
                  mt-1
                "
              >
                {
                  errors.confirm_password
                }
              </p>
            )}
          </div>

          {errors.api && (
            <div
              className="
                bg-red-50
                border
                border-red-200
                text-red-600
                text-sm
                rounded-xl
                p-3
              "
            >
              {errors.api}
            </div>
          )}

          <label
            className="
              flex
              items-start
              gap-3
              text-sm
              text-gray-600
            "
          >
            <input
              type="checkbox"
              required
              className="
                mt-1
                accent-red-600
              "
            />

            <span>
              I agree to the{" "}
              <span
                className="
                  text-red-600
                  font-medium
                "
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className="
                  text-red-600
                  font-medium
                "
              >
                Privacy Policy
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={
              loading
            }
            className="
              w-full
              h-12
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-semibold
              transition-all
              flex
              items-center
              justify-center
              gap-2
              disabled:opacity-70
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p
            className="
              text-center
              text-gray-500
              text-sm
            "
          >
            Already have an
            account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/login"
                )
              }
              className="
                text-red-600
                font-semibold
              "
            >
              Log In
            </button>
          </p>
        </form>
      </div>

      <OtpVerificationModal
        isOpen={
          showOtpModal
        }
        email={signupEmail}
        onClose={() =>
          setShowOtpModal(false)
        }
      />
    </>
  );
};

export default SignupForm;