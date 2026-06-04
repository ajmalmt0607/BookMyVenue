import { useState } from "react";

import {
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";

const SignupForm = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      console.log(formData);

      // API Integration Later
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
      {/* Heading */}

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
        Create your account to get started
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Names */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >
          <InputField
            icon={<User size={18} />}
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />

          <InputField
            icon={<User size={18} />}
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        {/* Email */}

        <InputField
          icon={<Mail size={18} />}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
        />

        {/* Phone */}

        <InputField
          icon={<Phone size={18} />}
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        {/* Password */}

        <PasswordField
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create Password"
        />

        {/* Confirm Password */}

        <PasswordField
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
        />

        {/* Terms */}

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
                cursor-pointer
              "
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              className="
                text-red-600
                font-medium
                cursor-pointer
              "
            >
              Privacy Policy
            </span>
          </span>
        </label>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
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
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login */}

        <p
          className="
            text-center
            text-gray-500
            text-sm
          "
        >
          Already have an account?{" "}
          <button
            type="button"
            className="
              text-red-600
              font-semibold
              hover:underline
            "
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;