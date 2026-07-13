import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getVenueDetail } from "../services/venueService";

import VenueGallery from "../components/venue-detail/VenueGallery";
import VenueInfo from "../components/venue-detail/VenueInfo";
import VenueDescription from "../components/venue-detail/VenueDescription";
import AmenitiesSection from "../components/venue-detail/AmenitiesSection";
import ThingsToKnowSection from "../components/venue-detail/ThingsToKnowSection";
import ReviewsSection from "../components/venue-detail/ReviewsSection";
import MapSection from "../components/venue-detail/MapSection";
import NearbySection from "../components/venue-detail/NearbySection";
import RelatedVenueCarousel from "../components/venue-detail/RelatedVenueCarousel";
import WhyBookSection from "../components/venue-detail/WhyBookSection";
import HostedEventsGallery from "../components/venue-detail/HostedEventsGallery";
import FAQSection from "../components/venue-detail/FAQSection";
import ContactVenueCard from "../components/venue-detail/ContactVenueCard";
import BookingCard from "../components/venue-detail/BookingCard";
import LazySection from "../components/venue-detail/LazySection";

import {
  GallerySkeleton,
  BookingCardSkeleton,
  DescriptionSkeleton,
  AmenitiesSkeleton,
  PoliciesSkeleton,
  ReviewsSkeleton,
  MapSkeleton,
  RelatedVenuesSkeleton,
} from "../components/venue-detail/VenueDetailSkeletons";

const VenueDetailPage = () => {
  const { slug } = useParams();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchVenue = async () => {
      try {
        const response = await getVenueDetail(slug);
        if (!cancelled) setVenue(response);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVenue();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading || !venue) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-16">
            <GallerySkeleton />
            <DescriptionSkeleton />
            <AmenitiesSkeleton />
            <PoliciesSkeleton />
            <ReviewsSkeleton />
            <MapSkeleton />
          </div>

          <BookingCardSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-16">
          <VenueGallery images={venue.images} />

          <VenueInfo venue={venue} />

          <VenueDescription description={venue.description} />

          <AmenitiesSection amenities={venue.amenities} />

          <ThingsToKnowSection policies={venue.policies} />

          <ReviewsSection reviews={venue.reviews} />

          <MapSection venue={venue} />

          <LazySection fallback={<div className="h-40" />}>
            <NearbySection />
          </LazySection>

          <LazySection fallback={<RelatedVenuesSkeleton />}>
            <RelatedVenueCarousel venue={venue} />
          </LazySection>

          <LazySection fallback={<div className="h-40" />}>
            <WhyBookSection />
          </LazySection>

          <LazySection fallback={<div className="h-40" />}>
            <HostedEventsGallery images={venue.images} />
          </LazySection>

          <LazySection fallback={<div className="h-40" />}>
            <FAQSection />
          </LazySection>

          <LazySection fallback={<div className="h-40" />}>
            <ContactVenueCard />
          </LazySection>
        </div>

        <BookingCard venue={venue} />
      </div>
    </section>
  );
};

export default VenueDetailPage;
