import { useLocation } from "react-router-dom";

// Derives customer-vs-venue-owner mode from the URL rather than local state,
// so deep links (/owner/login, /owner/signup) and the in-card mode toggle
// both just navigate - there's no separate "mode" state to fall out of sync
// with the route.
const useAuthMode = () => {
  const { pathname } = useLocation();

  return pathname.startsWith("/owner") ? "owner" : "customer";
};

export default useAuthMode;
