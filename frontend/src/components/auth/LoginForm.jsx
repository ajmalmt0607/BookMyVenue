import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Mail,
  Loader2,
} from "lucide-react";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";

import {
  loginSchema,
} from "../../validations/authValidation";

import {
  loginUser,
} from "../../services/authService";

import {
  setTokens,
} from "../../utils/tokenStorage";

import {
  loginSuccess,
} from "../../features/auth/authSlice";

const LoginForm = () => {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

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
      loginSchema.safeParse(
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

      const response =
        await loginUser(
          formData
        );

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
        })
      );

      navigate("/");

    } catch (error) {
      const apiError =
        error?.response?.data;

      setErrors({
        api:
          apiError?.message ||
          apiError?.detail ||
          "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        Welcome Back
      </h2>

      <p
        className="
          text-gray-500
          mt-2
          mb-8
        "
      >
        Login to continue booking
        venues.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
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
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
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
            placeholder="Password"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div
          className="
            flex
            justify-between
            items-center
            text-sm
          "
        >
          <label
            className="
              flex
              items-center
              gap-2
            "
          >
            <input
              type="checkbox"
              className="accent-red-600"
            />

            Remember Me
          </label>

          <button
            type="button"
            className="
              text-red-600
              font-medium
            "
          >
            Forgot Password?
          </button>
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

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-12
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
              Logging In...
            </>
          ) : (
            "Log In"
          )}
        </button>

        <p
          className="
            text-center
            text-sm
            text-gray-500
          "
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() =>
              navigate(
                "/signup"
              )
            }
            className="
              text-red-600
              font-semibold
            "
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;