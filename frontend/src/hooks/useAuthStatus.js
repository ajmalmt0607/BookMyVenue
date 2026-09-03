import { useSelector } from "react-redux";

import { getAccessToken } from "../utils/tokenStorage";
import {
  selectAuthStatus,
  selectRoles,
} from "../features/auth/authSlice";

const useAuthStatus = () => {
  const hasToken = !!getAccessToken();
  const status = useSelector(selectAuthStatus);
  const roles = useSelector(selectRoles);

  const isReady =
    !hasToken || status === "succeeded" || status === "failed";

  return {
    isAuthenticated: hasToken,
    roles,
    isReady,
  };
};

export default useAuthStatus;
