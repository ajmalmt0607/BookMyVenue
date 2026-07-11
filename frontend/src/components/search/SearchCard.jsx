import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import VenueTypeDropdown from "./VenueTypeDropdown";
import LocationSearch from "./LocationSearch";
import SingleDatePicker from "./SingleDatePicker";
import GuestSelector from "./GuestSelector";
import SearchButton from "./SearchButton";

import { ROUTES } from "../../constants/routes";

const SEARCH_TRANSITION_MS = 450;

const buildSearchParams = (searchData) => {
  const queryParams = new URLSearchParams();

  if (searchData.location) queryParams.append("location", searchData.location);
  if (searchData.venueType) queryParams.append("venue_type", searchData.venueType);
  if (searchData.guests) queryParams.append("guests", searchData.guests);
  if (searchData.date) queryParams.append("date", searchData.date);

  return queryParams;
};

const SearchCard = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    venueType: "",
    location: "",
    date: "",
    guests: "",
  });

  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const updateField = (field) => (fieldValue) => {
    setSearchData((prev) => ({ ...prev, [field]: fieldValue }));
  };

  const handleSearch = useCallback(() => {
    if (isSearching) return;

    setIsSearching(true);

    const queryParams = buildSearchParams(searchData);

    searchTimeoutRef.current = window.setTimeout(() => {
      navigate(`${ROUTES.VENUES}?${queryParams.toString()}`);
      setIsSearching(false);
    }, SEARCH_TRANSITION_MS);
  }, [isSearching, navigate, searchData]);

  return (
    <div
      className="
        bg-white rounded-3xl border border-gray-100
        shadow-[0_10px_40px_rgba(0,0,0,0.12)]
        p-6 mt-12
        transition-shadow duration-300 ease-out
        hover:shadow-[0_16px_50px_rgba(0,0,0,0.14)]
      "
    >
      <div className="grid gap-5 lg:grid-cols-5">
        <VenueTypeDropdown
          value={searchData.venueType}
          onChange={updateField("venueType")}
        />

        <LocationSearch
          value={searchData.location}
          onChange={updateField("location")}
        />

        <SingleDatePicker
          value={searchData.date}
          onChange={updateField("date")}
        />

        <GuestSelector
          value={searchData.guests}
          onChange={updateField("guests")}
          max={5000}
        />

        <SearchButton onClick={handleSearch} loading={isSearching} />
      </div>
    </div>
  );
};

export default SearchCard;
