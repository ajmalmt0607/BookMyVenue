import {
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import VenueGrid from "../components/venue/VenueGrid";
import VenueFilterSidebar from "../components/venue/VenueFilterSidebar";
import VenueSearchBar from "../components/venue/VenueSearchBar";
import VenueSortDropdown from "../components/venue/VenueSortDropdown";
import VenuePagination from "../components/venue/VenuePagination";

import { getVenues } from "../services/venueService";
import Navbar from "../components/layout/Navbar";

const VenueListPage = () => {

  const [searchParams] =
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

  return (
    <>
        <Navbar />
        <section
        className="
            max-w-7xl
            mx-auto
            px-5
            py-10
        "
        >

        {/* Header */}

        <div className="mb-8">

            <h1
            className="
                text-4xl
                font-bold
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
            conferences and more.
            </p>

        </div>

        {/* Search + Sort */}

        <div
            className="
            flex
            flex-col
            lg:flex-row
            gap-4
            justify-between
            mb-8
            "
        >

            <div className="flex-1">
            <VenueSearchBar />
            </div>

            <VenueSortDropdown />

        </div>

        {/* Count */}

        <div
            className="
            flex
            justify-between
            items-center
            mb-8
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

        {/* Main Content */}

        <div
            className="
            grid
            lg:grid-cols-[280px_1fr]
            gap-8
            items-start
            "
        >

            {/* Filters */}

            <VenueFilterSidebar />

            {/* Venue Listing */}

            <div>

            <VenueGrid
                venues={venues}
                loading={loading}
            />

            <VenuePagination
                totalPages={
                pagination?.total_pages || 1
                }
                currentPage={
                pagination?.page || 1
                }
            />

            </div>

        </div>

        </section>
    </>
  );
};

export default VenueListPage;