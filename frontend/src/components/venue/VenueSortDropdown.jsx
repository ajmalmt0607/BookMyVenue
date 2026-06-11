import { useSearchParams } from "react-router-dom";

const VenueSortDropdown = () => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const handleSortChange = (value) => {

    const params =
      new URLSearchParams(searchParams);

    params.set("ordering", value);

    setSearchParams(params);
  };

  return (
    <select
      value={
        searchParams.get("ordering") ||
        "-rating"
      }
      onChange={(e) =>
        handleSortChange(e.target.value)
      }
      className="
        h-12
        px-4
        rounded-xl
        border
        border-gray-200
        outline-none
        bg-white
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
  );
};

export default VenueSortDropdown;