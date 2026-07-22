// src/components/layout/MobileMenu.jsx

import { X, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import CustomNavLink from "../ui/NavLink";

import { ROUTES } from "../../constants/routes";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          bg-black/40
          z-40
        "
      />

      {/* Drawer */}

      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          w-80
          bg-white
          z-50
          shadow-xl
          p-6
          flex
          flex-col
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-2">

            <Building2
              size={24}
              className="text-red-600"
            />

            <span className="font-bold text-lg">
              BookMyVenue
            </span>

          </div>

          <button onClick={onClose}>
            <X size={24} />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex flex-col gap-5">

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

        {/* Actions */}

        <div className="mt-auto flex flex-col gap-3">

          <Button
            onClick={() => goTo(ROUTES.LOGIN)}
            className="
              border
              border-gray-300
              text-gray-800
              hover:bg-gray-50
            "
          >
            Login
          </Button>

          <Button
            onClick={() => goTo(ROUTES.SIGNUP)}
            className="
              border
              border-red-600
              text-red-600
              bg-white
              hover:bg-red-50
            "
          >
            Signup
          </Button>

          <Button
            onClick={() => goTo(ROUTES.OWNER_SIGNUP)}
            className="
              bg-red-600
              text-white
              hover:bg-red-700
            "
          >
            List Your Venue
          </Button>

        </div>

      </div>
    </>
  );
};

export default MobileMenu;