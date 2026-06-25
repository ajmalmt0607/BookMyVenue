import {
  Routes,
  Route,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/Home/HomePage";
import VenueListPage from "../pages/VenueListPage";
import VenueDetailPage from "../pages/VenueDetailPage";

import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";

import PublicRoute from "./PublicRoute";
import BookingSummaryPage from "../pages/Booking/BookingSummaryPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Layout */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/venues"
          element={<VenueListPage />}
        />

        <Route
          path="/venues/:slug"
          element={<VenueDetailPage />}
        />

        <Route
            path="/booking-summary/:bookingId"
            element={
                <ProtectedRoute>
                    <BookingSummaryPage />
                </ProtectedRoute>
            }
        />

      </Route>

      {/* Auth Layout */}

      <Route element={<AuthLayout />}>

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

      </Route>

    </Routes>
  );
};

export default AppRoutes;