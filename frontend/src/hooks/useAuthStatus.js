import { useSelector } from "react-redux";

import { getAccessToken } from "../utils/tokenStorage";
import {
  selectAuthStatus,
  selectRoles,
} from "../features/auth/authSlice";

// RequireAuth needs two things: is there a token at all, and - only when a
// route requires a specific role - has that token's role list finished
// loading. A token with an unresolved role list must never be treated as
// "missing that role", since that would redirect away for a split second.
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
