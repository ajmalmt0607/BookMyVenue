import { Search, Loader2 } from "lucide-react";

const SearchButton = ({ onClick, loading = false, label = "Search Venues" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="
        h-16 px-8 rounded-2xl font-semibold text-white
        flex items-center justify-center gap-2
        bg-red-600 cursor-pointer
        transition-all duration-300 ease-out
        hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0
        disabled:opacity-80 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-none
        focus:outline-none focus:ring-4 focus:ring-red-100
      "
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search size={20} />
          {label}
        </>
      )}
    </button>
  );
};

export default SearchButton;
