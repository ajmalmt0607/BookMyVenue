import { useSelector } from "react-redux";

import { selectUser } from "../../../features/auth/authSlice";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";

  return "Good Evening";
};

const DashboardGreeting = () => {
  const user = useSelector(selectUser);

  const name = user?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {getGreeting()}, {name}
      </h1>

      <p className="mt-1.5 text-gray-500">
        Welcome back to your venue dashboard.
      </p>
    </div>
  );
};

export default DashboardGreeting;
