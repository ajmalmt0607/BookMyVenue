import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";

const PublicLayout = () => {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
};

export default PublicLayout;