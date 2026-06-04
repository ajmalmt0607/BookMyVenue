import { Navigate } from "react-router-dom";

import { getAccessToken } from "../utils/tokenStorage";

const PublicRoute = ({
  children,
}) => {
  const token =
    getAccessToken();

  return token ? (
    <Navigate
      to="/"
      replace
    />
  ) : (
    children
  );
};

export default PublicRoute;