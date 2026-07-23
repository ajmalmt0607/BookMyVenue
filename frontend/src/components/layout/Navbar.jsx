import { useState } from "react";

import {
  Building2,
  Menu,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "../ui/Button";
import MobileMenu from "./MobileMenu";

import UserMenu from "../navbar/UserMenu";

import { selectRoles } from "../../features/auth/authSlice";
import { ROUTES } from "../../constants/routes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const roles = useSelector(selectRoles);
  const isVenueOwner = roles.includes("VENUE_OWNER");

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-30
          bg-white
          border-b
          border-gray-100
        "
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-6">

          <div
            className="
              h-[82px]
              flex
              items-center
              justify-between
            "
          >

            {/* Logo */}

            <div
              className="
                flex
                items-center
                gap-2
                cursor-pointer
                shrink-0
              "
              onClick={() => navigate("/")}
            >
              <Building2
                size={30}
                className="text-red-600"
              />

              <h1
                className="
                  text-[22px]
                  font-extrabold
                  tracking-tight
                  text-black
                "
              >
                BookMyVenue
              </h1>
            </div>

            {/* Desktop Actions */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-4
              "
            >

              {!isVenueOwner && (
                <Link to={ROUTES.OWNER_SIGNUP}>
                  <Button
                    className="
                      bg-red-600
                      text-white
                      hover:bg-red-700
                      px-6
                      shadow-sm
                    "
                  >
                    List Your Venue
                  </Button>
                </Link>
              )}

              <UserMenu />

            </div>

            {/* Mobile Hamburger */}

            <button
              onClick={() => setIsMenuOpen(true)}
              className="
                lg:hidden
                p-2
              "
            >
              <Menu size={28} />
            </button>

          </div>

        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;