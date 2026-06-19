import { Outlet } from "react-router-dom";

import AuthNavbar from "../components/auth/AuthNavbar";

const AuthLayout = () => {
  return (
    <>
      <AuthNavbar />
      <Outlet />
    </>
  );
};

export default AuthLayout;