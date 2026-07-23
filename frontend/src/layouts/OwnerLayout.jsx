import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import OwnerSidebar from "../components/owner/OwnerSidebar";

// Reuses the same Navbar as the customer site (per architecture decision:
// one navbar, contextual menu items) rather than a bespoke owner header.
const OwnerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <OwnerSidebar />

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;
