import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "../pages/Home/HomePage";

import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";

import PublicRoute from "./PublicRoute";
import VenueListPage from "../pages/VenueListPage";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/venues"
        element={<VenueListPage />}
      />

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

    </Routes>
  );
};

export default AppRoutes;