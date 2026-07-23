import { useEffect } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import OwnerLayout from "../layouts/OwnerLayout";

import HomePage from "../pages/Home/HomePage";
import VenueListPage from "../pages/VenueListPage";
import VenueDetailPage from "../pages/VenueDetailPage";

import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";

import DashboardPage from "../pages/owner/DashboardPage";
import VenueManagementPage from "../pages/owner/VenueManagementPage";

import PublicRoute from "./PublicRoute";
import RequireAuth from "./RequireAuth";

import ConfirmBookingPage from "../pages/Booking/ConfirmBookingPage";
import PaymentPage from "../pages/Booking/PaymentPage";
import ReservationExpiredPage from "../pages/Booking/ReservationExpiredPage";
import BookingConfirmationPage from "../pages/Booking/BookingConfirmationPage";

import ScrollToTop from "../components/common/ScrollToTop";

import { getAccessToken } from "../utils/tokenStorage";
import { loadCurrentUser } from "../features/auth/authSlice";

// ScrollToTop calls useLocation()/useNavigationType(), so it has to live
// inside the router tree rather than wrapping it - this root layout
// route is the data-router equivalent of what App.jsx used to do.
//
// It also kicks off the current-user fetch when a token already exists
// (e.g. page refresh) - RequireAuth's role check depends on
// state.auth.user.roles, which only lives in Redux and is lost on every
// reload, so it has to be re-derived from the server before any role check
// can trust it.
const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (getAccessToken()) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          // Customer pages are open to everyone, including venue owners -
          // no role check here at all.
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/venues",
            element: <VenueListPage />,
          },
          {
            path: "/venues/:slug",
            element: <VenueDetailPage />,
          },
          {
            element: <RequireAuth />,
            children: [
              {
                path: "/booking/confirm",
                element: <ConfirmBookingPage />,
              },
              {
                path: "/booking/:bookingId/payment",
                element: <PaymentPage />,
              },
              {
                path: "/booking/:bookingId/expired",
                element: <ReservationExpiredPage />,
              },
              {
                path: "/booking/:bookingId/confirmation",
                element: <BookingConfirmationPage />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/signup",
            element: (
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            ),
          },
          {
            path: "/login",
            element: (
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            ),
          },
          {
            path: "/owner/signup",
            element: (
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            ),
          },
          {
            path: "/owner/login",
            element: (
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            ),
          },
        ],
      },
      {
        element: <RequireAuth role="VENUE_OWNER" />,
        children: [
          {
            element: <OwnerLayout />,
            children: [
              {
                path: "/owner/dashboard",
                element: <DashboardPage />,
              },
              {
                path: "/owner/venues",
                element: <VenueManagementPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
