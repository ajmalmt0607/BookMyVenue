import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../constants/routes";

const SubmitSuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-lg animate-fade-in-up flex-col items-center px-5 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 size={40} className="text-green-600" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Your venue has been submitted for review.
      </h1>

      <p className="mt-3 text-gray-500">
        Our team will review your listing shortly. It'll become publicly
        visible on BookMyVenue as soon as it's approved.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(ROUTES.OWNER_DASHBOARD)}
          className="
            flex-1 rounded-xl border border-gray-200 py-3 text-sm
            font-semibold text-gray-700 transition-colors duration-200
            hover:bg-gray-50
          "
        >
          Back to Dashboard
        </button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.OWNER_VENUES)}
          className="
            flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold
            text-white transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
          "
        >
          View My Venues
        </button>
      </div>
    </div>
  );
};

export default SubmitSuccessScreen;
