import {
  useState,
  useRef,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  CircleUserRound,
  User,
  Heart,
  CalendarDays,
  LayoutDashboard,
  ArrowLeftRight,
  LogOut,
  CircleHelp,
} from "lucide-react";

import useClickOutside from "../../hooks/useClickOutside";

import {
  getAccessToken,
  clearTokens,
} from "../../utils/tokenStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectRoles,
} from "../../features/auth/authSlice";
import { ROUTES } from "../../constants/routes";

const UserMenu = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [isOpen, setIsOpen] =
    useState(false);
  const dispatch = useDispatch();

  const menuRef =
    useRef(null);

  useClickOutside(
    menuRef,
    () => setIsOpen(false)
  );

  const isAuthenticated =
    !!getAccessToken();

  const roles = useSelector(
    selectRoles
  );

  const isVenueOwner =
    roles.includes(
      "VENUE_OWNER"
    );

  const isInOwnerArea =
    location.pathname.startsWith(
      "/owner"
    );

  const handleLogout = () => {

    clearTokens();

    dispatch(logout());

    setIsOpen(false);

    navigate("/", {
      replace: true,
    });

  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Trigger */}

      <button
        onClick={() =>
          setIsOpen(
            !isOpen
          )
        }
        className="
          flex
          items-center
          gap-3
          border
          border-gray-200
          rounded-full
          px-4
          py-2
          hover:shadow-md
          transition-all
          duration-200
          cursor-pointer
        "
      >
        <Menu size={18} />

        <CircleUserRound
          size={26}
          className="
            text-gray-600
          "
        />
      </button>

      {/* Dropdown */}

      {isOpen && (
        <div
          className="
            absolute
            top-14
            right-0
            w-72
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-100
            py-2
            overflow-hidden
            z-50
          "
        >

          {/* Logged Out Menu */}

          {!isAuthenticated && (
            <>
              <button
                onClick={() => {
                  navigate(
                    ROUTES.LOGIN
                  );

                  setIsOpen(
                    false
                  );
                }}
                className="
                  w-full
                  px-5
                  py-3
                  text-left
                  font-semibold
                  hover:bg-gray-50
                "
              >
                Log In
              </button>

              <button
                onClick={() => {
                  navigate(
                    ROUTES.SIGNUP
                  );

                  setIsOpen(
                    false
                  );
                }}
                className="
                  w-full
                  px-5
                  py-3
                  text-left
                  hover:bg-gray-50
                "
              >
                Sign Up
              </button>

              <div
                className="
                  border-t
                  my-2
                "
              />

              <button
                onClick={() => {
                  navigate(
                    ROUTES.OWNER_SIGNUP
                  );

                  setIsOpen(
                    false
                  );
                }}
                className="
                  w-full
                  px-5
                  py-3
                  text-left
                  hover:bg-gray-50
                "
              >
                List Your Venue
              </button>

              <button
                className="
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                  hover:bg-gray-50
                "
              >
                <CircleHelp
                  size={18}
                />

                Help Center
              </button>
            </>
          )}

          {/* Logged In Menu */}

          {isAuthenticated && (
            <>
              {isVenueOwner && (
                <>
                  {isInOwnerArea ? (
                    <button
                      onClick={() => {
                        navigate(
                          ROUTES.HOME
                        );

                        setIsOpen(
                          false
                        );
                      }}
                      className="
                        w-full
                        px-5
                        py-3
                        flex
                        items-center
                        gap-3
                        hover:bg-gray-50
                      "
                    >
                      <ArrowLeftRight
                        size={18}
                      />

                      Back to Customer Site
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(
                          ROUTES.OWNER_DASHBOARD
                        );

                        setIsOpen(
                          false
                        );
                      }}
                      className="
                        w-full
                        px-5
                        py-3
                        flex
                        items-center
                        gap-3
                        hover:bg-gray-50
                      "
                    >
                      <LayoutDashboard
                        size={18}
                      />

                      Switch to Owner Dashboard
                    </button>
                  )}

                  <div
                    className="
                      border-t
                      my-2
                    "
                  />
                </>
              )}

              <button
                onClick={() => {
                  navigate(
                    "/profile"
                  );

                  setIsOpen(
                    false
                  );
                }}
                className="
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                  hover:bg-gray-50
                "
              >
                <User size={18} />

                Profile
              </button>

              <button
                onClick={() => {
                  navigate(
                    "/bookings"
                  );

                  setIsOpen(
                    false
                  );
                }}
                className="
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                  hover:bg-gray-50
                "
              >
                <CalendarDays
                  size={18}
                />

                My Bookings
              </button>

              <button
                onClick={() => {
                  navigate(
                    "/wishlist"
                  );

                  setIsOpen(
                    false
                  );
                }}
                className="
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                  hover:bg-gray-50
                "
              >
                <Heart size={18} />

                Wishlist
              </button>

              <div
                className="
                  border-t
                  my-2
                "
              />

              <button
                onClick={
                  handleLogout
                }
                className="
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                  text-red-600
                  hover:bg-red-50
                "
              >
                <LogOut
                  size={18}
                />

                Logout
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default UserMenu;