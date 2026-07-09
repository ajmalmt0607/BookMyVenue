import {
  useNavigate,
} from "react-router-dom";

import {
  CalendarCheck,
  Download,
  Home,
} from "lucide-react";

const ConfirmationActions = () => {

  const navigate =
    useNavigate();

  const handleDownloadReceipt = () => {

    window.alert(
      "Receipt download will be available soon."
    );

  };

  return (
    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:justify-between
        gap-3
        mt-6
      "
    >

      <button
        type="button"
        onClick={() =>
          navigate("/")
        }
        className="
          border
          border-gray-200
          px-5
          py-3
          rounded-xl
          flex
          items-center
          justify-center
          gap-2
          hover:bg-gray-50
          transition
        "
      >

        <Home
          size={16}
        />

        Back to Home

      </button>

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
        "
      >

        <button
          type="button"
          onClick={
            handleDownloadReceipt
          }
          className="
            border-2
            border-red-600
            text-red-600
            hover:bg-red-50
            px-5
            py-3
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition
          "
        >

          <Download
            size={16}
          />

          Download Receipt

        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/bookings")
          }
          className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-2
          "
        >

          <CalendarCheck
            size={16}
          />

          View My Bookings

        </button>

      </div>

    </div>
  );

};

export default ConfirmationActions;
