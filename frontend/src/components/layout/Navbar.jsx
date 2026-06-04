import { useState } from "react";

import {
  Building2,
  Menu,
  CircleUserRound,
} from "lucide-react";

import Button from "../ui/Button";
import CustomNavLink from "../ui/NavLink";
import MobileMenu from "./MobileMenu";

import { ROUTES } from "../../constants/routes";
import UserMenu from "../navbar/UserMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-5">

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

            {/* Desktop Navigation */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                gap-10
              "
            >
              <CustomNavLink to={ROUTES.HOME}>
                Home
              </CustomNavLink>

              <CustomNavLink to={ROUTES.VENUES}>
                Venues
              </CustomNavLink>

              <CustomNavLink to={ROUTES.HOW_IT_WORKS}>
                How It Works
              </CustomNavLink>

              <CustomNavLink to={ROUTES.FOR_OWNERS}>
                For Owners
              </CustomNavLink>

              <CustomNavLink to={ROUTES.PRICING}>
                Pricing
              </CustomNavLink>

              <CustomNavLink to={ROUTES.ABOUT}>
                About Us
              </CustomNavLink>
            </nav>

            {/* Desktop Actions */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-4
              "
            >

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