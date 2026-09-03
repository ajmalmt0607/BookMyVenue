import { useLocation } from "react-router-dom";


const useAuthMode = () => {
  const { pathname } = useLocation();

  return pathname.startsWith("/owner") ? "owner" : "customer";
};

export default useAuthMode;
