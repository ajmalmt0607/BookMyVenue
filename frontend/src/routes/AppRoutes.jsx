import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import SignupPage from "../pages/auth/SignupPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/signup"
        element={<SignupPage />}
      />
    </Routes>
  );
};

export default AppRoutes;