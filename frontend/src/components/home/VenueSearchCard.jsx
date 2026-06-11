import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ChevronDown,
  MapPin,
  Calendar,
  Users,
  Search,
} from "lucide-react";

const VenueSearchCard = () => {

  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    venueType: "",
    location: "",
    date: "",
    guests: "",
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {

    const queryParams =
      new URLSearchParams();

    if (searchData.location) {
      queryParams.append(
        "location",
        searchData.location
      );
    }

    if (searchData.venueType) {
      queryParams.append(
        "venue_type",
        searchData.venueType
      );
    }

    if (searchData.guests) {
      queryParams.append(
        "guests",
        searchData.guests
      );
    }

    navigate(
      `/venues?${queryParams.toString()}`
    );
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-[0_10px_40px_rgba(0,0,0,0.12)]
        p-6
        mt-12
      "
    >
      <div
        className="
          grid
          lg:grid-cols-5
          gap-5
        "
      >

        {/* Venue Type */}

        <div className="relative">

          <select
            name="venueType"
            value={searchData.venueType}
            onChange={handleChange}
            className="
              w-full
              h-16
              appearance-none
              border
              border-gray-200
              rounded-xl
              px-4
              pr-10
              bg-white
              outline-none
              cursor-pointer
              focus:border-red-500
              focus:ring-2
              focus:ring-red-100
            "
          >
            <option value="">
              All Venues
            </option>

            <option value="banquet-hall">
              Banquet Hall
            </option>

            <option value="wedding-hall">
              Wedding Hall
            </option>

            <option value="conference-room">
              Conference Room
            </option>

            <option value="auditorium">
              Auditorium
            </option>

            <option value="resort">
              Resort
            </option>

          </select>

          <ChevronDown
            size={18}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
              pointer-events-none
            "
          />

        </div>

        {/* Location */}

        <div className="relative">

          <MapPin
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
            name="location"
            value={searchData.location}
            placeholder="Enter Location"
            onChange={handleChange}
            className="
              w-full
              h-16
              border
              border-gray-200
              rounded-xl
              pl-12
              pr-4
              outline-none
              focus:border-red-500
              focus:ring-2
              focus:ring-red-100
            "
          />

        </div>

        {/* Date */}

        <div className="relative">

          <Calendar
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
            type="date"
            name="date"
            value={searchData.date}
            onChange={handleChange}
            className="
              w-full
              h-16
              border
              border-gray-200
              rounded-xl
              pl-12
              pr-4
              outline-none
              focus:border-red-500
              focus:ring-2
              focus:ring-red-100
            "
          />

        </div>

        {/* Guests */}

        <div className="relative">

          <Users
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
            type="number"
            min="1"
            name="guests"
            value={searchData.guests}
            placeholder="Guests"
            onChange={handleChange}
            className="
              w-full
              h-16
              border
              border-gray-200
              rounded-xl
              pl-12
              pr-4
              outline-none
              focus:border-red-500
              focus:ring-2
              focus:ring-red-100
            "
          />

        </div>

        {/* Search Button */}

        <button
          onClick={handleSearch}
          className="
            h-16
            bg-red-600
            hover:bg-red-700
            text-white
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
            duration-300
            hover:shadow-lg
          "
        >
          <Search size={18} />

          Search Venues

        </button>

      </div>
    </div>
  );
};

export default VenueSearchCard;