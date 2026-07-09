import {
  RefreshCw,
} from "lucide-react";

const EmptyState = ({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
}) => {

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-gray-100
        p-12
        text-center
      "
    >

      <h3
        className="
          text-2xl
          font-bold
          text-gray-900
        "
      >
        {title}
      </h3>

      <p
        className="
          text-gray-500
          mt-3
        "
      >
        {description}
      </p>

      {onRetry && (

        <button
          type="button"
          onClick={onRetry}
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            bg-red-600
            hover:bg-red-700
            text-white
            px-5
            py-2.5
            rounded-xl
            font-semibold
            transition
          "
        >

          <RefreshCw
            size={16}
          />

          Retry

        </button>

      )}

    </div>
  );

};

export default EmptyState;
