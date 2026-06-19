import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getVenueDetail,
  getVenueAvailability,
} from "../services/venueService";

import VenueGallery from "../components/venue-detail/VenueGallery";
import VenueInfo from "../components/venue-detail/VenueInfo";
import VenueAmenities from "../components/venue-detail/VenueAmenities";
import VenueBookingCard from "../components/venue-detail/VenueBookingCard";

const VenueDetailPage = () => {

  const { slug } = useParams();

  const [venue, setVenue] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [slots, setSlots] =
    useState([]);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  useEffect(() => {

    const fetchVenue = async () => {

      try {

        const response =
          await getVenueDetail(slug);

        setVenue(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchVenue();

  }, [slug]);

  useEffect(() => {

    const fetchAvailability =
      async () => {

        try {

          const response =
            await getVenueAvailability(
              slug,
              selectedDate
            );

          console.log(
            "Availability:",
            response
          );

          setSlots(
            response?.data || []
          );

        } catch (error) {

          console.error(error);

          setSlots([]);

        }

      };

    if (
      slug &&
      selectedDate
    ) {
      fetchAvailability();
    }

  }, [
    slug,
    selectedDate,
  ]);

  if (
    loading ||
    !venue
  ) {
    return (
      <div className="p-20">
        Loading...
      </div>
    );
  }

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-5
        py-10
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[1fr_380px]
          gap-10
          items-start
        "
      >

        <div>

          <VenueGallery
            images={
              venue.images
            }
          />

          <VenueInfo
            venue={venue}
          />

          <VenueAmenities
            amenities={
              venue.amenities
            }
          />

        </div>

        <VenueBookingCard
          venue={venue}
          slots={slots}
          selectedDate={
            selectedDate
          }
          setSelectedDate={
            setSelectedDate
          }
        />

      </div>

    </section>
  );
};

export default VenueDetailPage;