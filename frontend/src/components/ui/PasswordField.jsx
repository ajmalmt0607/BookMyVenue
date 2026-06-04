import { useState } from "react";

import {
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const PasswordField = ({
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="relative">

      <Lock
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        {...props}
        type={
          showPassword
            ? "text"
            : "password"
        }
        className={`
          w-full
          h-12
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          pl-12
          pr-12
          outline-none
          transition-all
          focus:border-red-500
          focus:bg-white
          ${className}
        `}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword(
            !showPassword
          )
        }
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>

    </div>
  );
};

export default PasswordField;