import { Link } from "react-router-dom";

import { Building2 } from "lucide-react";

import { ROUTES } from "../../constants/routes";

const AuthNavbar = () => {
  return (
    <header
      className="
        bg-white
        border-b
        border-gray-100
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-5
        "
      >
        <div
          className="
            h-[82px]
            flex
            items-center
            justify-between
          "
        >
          {/* Logo */}

          <Link
            to={ROUTES.HOME}
            className="
              flex
              items-center
              gap-2
            "
          >
            <Building2
              size={30}
              className="text-red-600"
            />

            <span
              className="
                text-[22px]
                font-extrabold
                tracking-tight
                text-black
              "
            >
              BookMyVenue
            </span>
          </Link>

          {/* Right Action */}

          <Link
            to={ROUTES.HOME}
            className="
              text-sm
              font-medium
              text-gray-500
              hover:text-gray-900
              transition-colors
            "
          >
            Back to Home
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;