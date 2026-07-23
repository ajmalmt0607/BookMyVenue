import { Navigate, Outlet, useLocation } from "react-router-dom";

import FullPageLoader from "../components/common/FullPageLoader";
import useAuthStatus from "../hooks/useAuthStatus";
import { ROUTES } from "../constants/routes";

// Single guard for every route that needs a login, optionally scoped to a
// role (e.g. role="VENUE_OWNER" for the owner area). Booking pages use it
// with no role - any authenticated user, owner or not, can book. Frontend
// gating here is for UX only (avoid rendering a page that'll just 403); the
// backend enforces the real permission check on each request.
const RequireAuth = ({ role }) => {
  const location = useLocation();
  const { isAuthenticated, roles, isReady } = useAuthStatus();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (role) {
    if (!isReady) {
      return <FullPageLoader />;
    }

    if (!roles.includes(role)) {
      return (
        <Navigate
          to={ROUTES.HOME}
          replace
        />
      );
    }
  }

  return <Outlet />;
};

export default RequireAuth;
