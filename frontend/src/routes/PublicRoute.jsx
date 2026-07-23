import { Navigate, useLocation } from "react-router-dom";

import { getAccessToken } from "../utils/tokenStorage";
import { ROUTES } from "../constants/routes";

// Guards /login, /signup, /owner/login, /owner/signup from an already
// logged-in visitor. Redirect target is never role-based - just wherever
// RequireAuth sent them from (location.state.from), or home.
const PublicRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();

  if (isAuthenticated) {
    return (
      <Navigate
        to={location.state?.from?.pathname ?? ROUTES.HOME}
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;
