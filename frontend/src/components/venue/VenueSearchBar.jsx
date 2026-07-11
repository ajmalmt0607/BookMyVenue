import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const VenueSearchBar = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const handleSearch = (value) => {
    const params =
      new URLSearchParams(searchParams);

    if (value) {
      params.set("location", value);
    } else {
      params.delete("location");
    }

    params.set("page", 1);

    setSearchParams(params, {
        replace: true,
    });
  };

  return (
    <div className="relative">

      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-red-600
        "
      />

      <input
        type="text"
        placeholder="Search venues or location..."
        defaultValue={
          searchParams.get("location") || ""
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.target.value);
          }
        }}
        className="
          w-full
          h-12
          pl-11
          pr-4
          rounded-2xl
          border
          border-gray-200
          outline-none
          transition-all
          duration-200
          ease-out
          hover:border-red-300
          hover:shadow-sm
          focus:border-red-500
          focus:ring-4
          focus:ring-red-100
        "
      />

    </div>
  );
};

export default VenueSearchBar;