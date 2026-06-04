import { NavLink } from "react-router-dom";

const CustomNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        text-sm
        font-medium
        transition-colors
        duration-200
        ${
          isActive
            ? "text-red-600"
            : "text-gray-700 hover:text-red-600"
        }
      `
      }
    >
      {children}
    </NavLink>
  );
};

export default CustomNavLink;