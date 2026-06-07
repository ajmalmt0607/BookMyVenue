import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "../pages/Home/HomePage";

import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";

import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Home */}

      <Route
        path="/"
        element={<HomePage />}
      />

      {/* Signup */}

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Login */}

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