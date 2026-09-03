import { Navigate, Outlet, useLocation } from "react-router-dom";

import FullPageLoader from "../components/common/FullPageLoader";
import useAuthStatus from "../hooks/useAuthStatus";
import { ROUTES } from "../constants/routes";


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
