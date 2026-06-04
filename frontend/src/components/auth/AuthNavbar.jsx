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

          {/* Right Actions */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <Link
              to={ROUTES.OWNER_SIGNUP}
              className="
                hidden
                sm:flex
                items-center
                justify-center
                px-6
                h-11
                border
                border-red-600
                rounded-xl
                text-red-600
                font-medium
                hover:bg-red-50
                transition-all
              "
            >
              List Your Venue
            </Link>

            <Link
              to={ROUTES.LOGIN}
              className="
                flex
                items-center
                justify-center
                px-6
                h-11
                bg-black
                text-white
                rounded-xl
                font-medium
                hover:bg-gray-800
                transition-all
              "
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;