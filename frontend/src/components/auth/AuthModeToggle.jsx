import { Link } from "react-router-dom";

import {
  Building2,
  CalendarCheck,
} from "lucide-react";

import { ROUTES } from "../../constants/routes";
import useAuthMode from "../../hooks/useAuthMode";

const AuthModeToggle = ({ type }) => {
  const mode = useAuthMode();

  const segments = [
    {
      key: "customer",
      label: "Book a Venue",
      icon: CalendarCheck,
      to: type === "login" ? ROUTES.LOGIN : ROUTES.SIGNUP,
    },
    {
      key: "owner",
      label: "List My Venue",
      icon: Building2,
      to: type === "login" ? ROUTES.OWNER_LOGIN : ROUTES.OWNER_SIGNUP,
    },
  ];

  return (
    <div
      className="
        flex
        bg-gray-100
        rounded-full
        p-1.5
        mb-8
      "
    >
      {segments.map(({ key, label, icon: Icon, to }) => {
        const isActive = mode === key;

        return (
          <Link
            key={key}
            to={to}
            className={`
              flex-1
              flex
              items-center
              justify-center
              gap-2
              h-11
              rounded-full
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                isActive
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default AuthModeToggle;
