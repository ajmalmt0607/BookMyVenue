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

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Pages */}

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

      </Route>

      {/* Auth Pages */}

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