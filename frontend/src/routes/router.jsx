import { Outlet, createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/Home/HomePage";
import VenueListPage from "../pages/VenueListPage";
import VenueDetailPage from "../pages/VenueDetailPage";

import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import ConfirmBookingPage from "../pages/Booking/ConfirmBookingPage";
import PaymentPage from "../pages/Booking/PaymentPage";
import ReservationExpiredPage from "../pages/Booking/ReservationExpiredPage";
import BookingConfirmationPage from "../pages/Booking/BookingConfirmationPage";

import ScrollToTop from "../components/common/ScrollToTop";

// ScrollToTop calls useLocation()/useNavigationType(), so it has to live
// inside the router tree rather than wrapping it - this root layout
// route is the data-router equivalent of what App.jsx used to do.
const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
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
            path: "/booking/confirm",
            element: (
              <ProtectedRoute>
                <ConfirmBookingPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/booking/:bookingId/payment",
            element: (
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/booking/:bookingId/expired",
            element: (
              <ProtectedRoute>
                <ReservationExpiredPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/booking/:bookingId/confirmation",
            element: (
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            ),
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
        ],
      },
    ],
  },
]);

export default router;
