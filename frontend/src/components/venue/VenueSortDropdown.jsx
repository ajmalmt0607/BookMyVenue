import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const VenueSortDropdown = () => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const handleSortChange = (value) => {

    const params =
      new URLSearchParams(searchParams);

    params.set("ordering", value);

    setSearchParams(params, {
      replace: true,
    });
  };

  return (
    <div className="relative min-w-[200px]">

      <select
        value={
          searchParams.get("ordering") ||
          "-rating"
        }
        onChange={(e) =>
          handleSortChange(e.target.value)
        }
        className="
          w-full
          h-12
          appearance-none
          bg-white
          border
          border-gray-200
          rounded-2xl
          px-4
          pr-10
          text-sm
          font-medium
          text-gray-700
          outline-none
          cursor-pointer
          transition-all
          duration-200
          ease-out
          hover:border-red-300
          hover:shadow-sm
          focus:border-red-500
          focus:ring-4
          focus:ring-red-100
        "
      >
        <option value="-rating">
          Top Rated
        </option>

        <option value="rating">
          Lowest Rated
        </option>

        <option value="-price_per_day">
          Price High To Low
        </option>

        <option value="price_per_day">
          Price Low To High
        </option>

      </select>

      <ChevronDown
        size={18}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-red-600
          pointer-events-none
        "
      />

    </div>
  );
};

export default VenueSortDropdown;