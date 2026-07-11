import { ChevronLeft, ChevronRight }
from "lucide-react";

import { useSearchParams }
from "react-router-dom";

const VenuePagination = ({
  totalPages,
  currentPage,
}) => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const changePage = (page) => {

    const params =
      new URLSearchParams(searchParams);

    params.set("page", page);

    setSearchParams(params);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="
        flex
        justify-center
        items-center
        gap-2
        mt-12
      "
    >

      <button
        disabled={currentPage === 1}
        onClick={() =>
          changePage(currentPage - 1)
        }
        aria-label="Previous page"
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl border border-gray-200 text-gray-600
          transition-all duration-200 ease-out
          hover:border-red-300 hover:text-red-600
          disabled:opacity-40 disabled:cursor-not-allowed
          disabled:hover:border-gray-200 disabled:hover:text-gray-600
        "
      >
        <ChevronLeft size={18} />
      </button>

      {[...Array(totalPages)].map(
        (_, index) => (
          <button
            key={index}
            onClick={() =>
              changePage(index + 1)
            }
            className={`
              h-10 w-10 rounded-xl border text-sm font-semibold
              transition-all duration-200 ease-out
              ${
                currentPage === index + 1
                  ? "bg-red-600 text-white border-red-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
              }
            `}
          >
            {index + 1}
          </button>
        )
      )}

      <button
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          changePage(currentPage + 1)
        }
        aria-label="Next page"
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl border border-gray-200 text-gray-600
          transition-all duration-200 ease-out
          hover:border-red-300 hover:text-red-600
          disabled:opacity-40 disabled:cursor-not-allowed
          disabled:hover:border-gray-200 disabled:hover:text-gray-600
        "
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default VenuePagination;