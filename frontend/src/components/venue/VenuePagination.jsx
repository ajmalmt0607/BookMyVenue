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
        mt-10
      "
    >

      <button
        disabled={currentPage === 1}
        onClick={() =>
          changePage(currentPage - 1)
        }
        className="
          p-2
          rounded-lg
          border
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
              w-10
              h-10
              rounded-lg
              border

              ${
                currentPage ===
                index + 1
                  ? "bg-red-600 text-white border-red-600"
                  : ""
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
        className="
          p-2
          rounded-lg
          border
        "
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default VenuePagination;