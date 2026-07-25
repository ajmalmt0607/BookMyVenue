import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building2 } from "lucide-react";

import { ROUTES } from "../../constants/routes";
import { OWNER_STICKY_TOP_MD } from "../../constants/layout";

const NAV_ITEMS = [
  {
    to: ROUTES.OWNER_DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: ROUTES.OWNER_VENUES,
    label: "Venue Management",
    icon: Building2,
  },
];

const OwnerSidebar = () => {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <nav
        className={`
          bg-white
          rounded-3xl
          border
          border-gray-100
          shadow-sm
          p-3
          flex
          flex-row
          md:flex-col
          gap-1
          overflow-x-auto
          md:overflow-visible
          md:sticky
          ${OWNER_STICKY_TOP_MD}
        `}
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              text-sm
              font-medium
              whitespace-nowrap
              transition-colors
              ${
                isActive
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
              `
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default OwnerSidebar;
