import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import SignupPage from "../pages/auth/SignupPage";

import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Public Home */}

      <Route
        path="/"
        element={<HomePage />}
      />

    </Routes>
  );
};

export default AppRoutes;