import { useSearchParams } from "react-router-dom";

const VENUE_TYPES = [
  {
    label: "Wedding Hall",
    value: "wedding-hall",
  },
  {
    label: "Banquet Hall",
    value: "banquet-hall",
  },
  {
    label: "Conference Room",
    value: "conference-room",
  },
  {
    label: "Auditorium",
    value: "auditorium",
  },
  {
    label: "Resort",
    value: "resort",
  },
];

const GUEST_OPTIONS = [
  50,
  100,
  250,
  500,
  1000,
];

const VenueFilterSidebar = () => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const updateFilter = (
    key,
    value
  ) => {

    const params =
      new URLSearchParams(
        searchParams
      );

    if (value) {
      params.set(
        key,
        value
      );
    } else {
      params.delete(key);
    }

    params.set(
      "page",
      1
    );

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div
        className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            p-6
            sticky
            top-24
            self-start
        "
    >   

      {/* Header */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >
        <h3
          className="
            font-bold
            text-lg
          "
        >
          Filters
        </h3>

        <button
          onClick={clearFilters}
          className="
            text-red-600
            text-sm
            font-medium
          "
        >
          Clear All
        </button>
      </div>

      {/* Location */}

      <div className="mb-6">

        <label
          className="
            block
            text-sm
            font-semibold
            mb-2
          "
        >
          Location
        </label>

        <input
          type="text"
          placeholder="Kottakkal"
          defaultValue={
            searchParams.get(
              "location"
            ) || ""
          }
          onBlur={(e) =>
            updateFilter(
              "location",
              e.target.value
            )
          }
          className="
            w-full
            border
            border-gray-200
            rounded-xl
            px-4
            py-3
            outline-none
            focus:border-red-500
          "
        />

      </div>

      {/* Venue Type */}

      <div className="mb-6">

        <label
          className="
            block
            text-sm
            font-semibold
            mb-3
          "
        >
          Venue Type
        </label>

        <div className="space-y-3">

          {VENUE_TYPES.map(
            (type) => (
              <label
                key={type.value}
                className="
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                "
              >
                <input
                  type="radio"
                  name="venueType"
                  checked={
                    searchParams.get(
                      "venue_type"
                    ) === type.value
                  }
                  onChange={() =>
                    updateFilter(
                      "venue_type",
                      type.value
                    )
                  }
                />

                <span>
                  {type.label}
                </span>
              </label>
            )
          )}

        </div>

      </div>

      {/* Capacity */}

      <div>

        <label
          className="
            block
            text-sm
            font-semibold
            mb-3
          "
        >
          Capacity
        </label>

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          {GUEST_OPTIONS.map(
            (guest) => (
              <button
                key={guest}
                onClick={() =>
                  updateFilter(
                    "guests",
                    guest
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-lg
                  border
                  text-sm
                  transition-all

                  ${
                    searchParams.get(
                      "guests"
                    ) ===
                    String(guest)
                      ? "bg-red-600 text-white border-red-600"
                      : "border-gray-200"
                  }
                `}
              >
                {guest}+
              </button>
            )
          )}
        </div>

      </div>

    </div>
  );
};

export default VenueFilterSidebar;