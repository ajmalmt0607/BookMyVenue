import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";

import { ROUTES } from "../../constants/routes";

const HeroActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-9">
      <Link
        to={ROUTES.VENUES}
        className="
          group inline-flex items-center gap-2 h-14 px-8
          bg-red-600 text-white font-semibold rounded-2xl
          shadow-[0_8px_24px_rgba(220,38,38,0.25)]
          transition-all duration-300 ease-out
          hover:bg-red-700 hover:-translate-y-0.5
          hover:shadow-[0_12px_32px_rgba(220,38,38,0.32)]
        "
      >
        Explore Venues
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>

      <Link
        to={ROUTES.HOW_IT_WORKS}
        className="
          group inline-flex items-center gap-2 h-14 px-8
          bg-white text-gray-900 font-semibold rounded-2xl
          border border-gray-200
          transition-all duration-300 ease-out
          hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md
        "
      >
        <PlayCircle size={18} className="text-red-600" />
        How It Works
      </Link>
    </div>
  );
};

export default HeroActions;
