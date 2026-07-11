import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import VenueGrid from "../components/venue/VenueGrid";
import VenueFilters from "../components/venue/VenueFilters";
import VenueSearchBar from "../components/venue/VenueSearchBar";
import VenueSortDropdown from "../components/venue/VenueSortDropdown";
import VenuePagination from "../components/venue/VenuePagination";

import { getVenues } from "../services/venueService";

const RESETTABLE_FILTER_KEYS = ["location", "venue_type", "guests"];

const VenueListPage = () => {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [venues, setVenues] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [pagination, setPagination] =
    useState(null);

  const fetchVenues = async () => {

    try {

      setLoading(true);

      const params = {
        location:
          searchParams.get(
            "location"
          ) || "",

        venue_type:
          searchParams.get(
            "venue_type"
          ) || "",

        guests:
          searchParams.get(
            "guests"
          ) || "",

        ordering:
          searchParams.get(
            "ordering"
          ) || "-rating",

        page:
          searchParams.get(
            "page"
          ) || 1,
      };

      const response =
        await getVenues(params);

      setVenues(response.data);

      setPagination(
        response.pagination
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchVenues();

  }, [searchParams]);

  const handleResetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    RESETTABLE_FILTER_KEYS.forEach((key) => params.delete(key));
    params.set("page", 1);

    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return (
        <section
        className="
            max-w-7xl
            mx-auto
            px-5
            py-10
        "
        >

        {/* Header */}

        {/* <div className="mb-8 text-center items-center">

            <h1
            className="
                text-2xl
                font-bold
                tracking-tight
                text-gray-900
            "
            >
            Find Your Perfect Venue
            </h1>

            <p
            className="
                text-gray-500
                mt-3
            "
            >
            Browse verified venues for
            weddings, events,
            conferences and more
            </p>

        </div> */}

        {/* Search + Filters + Sort */}

        <div
            className="
            flex
            flex-col
            sm:flex-row
            gap-3
            mb-8
            "
        >

            <div className="flex-1">
            <VenueSearchBar />
            </div>

            <div className="flex gap-3">
              <VenueFilters />
              <VenueSortDropdown />
            </div>

        </div>

        {/* Count */}

        <div
            className="
            flex
            justify-between
            items-center
            mb-6
            "
        >

            <p
            className="
                text-gray-500
                font-medium
            "
            >
            {pagination?.count || 0}
            {" "}
            venues found
            </p>

        </div>

        {/* Venue Listing */}

        <VenueGrid
            venues={venues}
            loading={loading}
            onResetFilters={handleResetFilters}
        />

        <VenuePagination
            totalPages={
            pagination?.total_pages || 1
            }
            currentPage={
            pagination?.page || 1
            }
        />

        </section>
  );
};

export default VenueListPage;
