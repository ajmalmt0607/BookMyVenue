import { memo, useMemo } from "react";

import VenueCard from "../venue/VenueCard";
import { RelatedVenuesSkeleton } from "./VenueDetailSkeletons";

// Placeholder until a real "similar venues" API exists — reuses the real
// VenueCard for visual consistency and the current venue's own photos/slug
// as stand-in data so there are no broken links or fabricated venues.
const buildMockVenues = (venue) => {
  if (!venue) return [];

  const images = venue.images?.map((image) => image.image) || [];

  return [1, 2, 3].map((multiplier) => ({
    id: `similar-${multiplier}`,
    slug: venue.slug,
    name: `${venue.venue_type} in ${venue.city}`,
    venue_type: venue.venue_type,
    city: venue.city,
    price_per_day: Number(venue.price_per_day || 0) * (0.8 + multiplier * 0.15),
    rating: venue.rating,
    max_capacity: venue.max_capacity,
    images,
  }));
};

const RelatedVenueCarousel = ({ venue, loading = false }) => {
  const mockVenues = useMemo(() => buildMockVenues(venue), [venue]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Similar Venues</h2>
      <p className="mt-1 text-gray-500">You might also like these venues.</p>

      <div className="mt-6">
        {loading ? (
          <RelatedVenuesSkeleton />
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-2">
            {mockVenues.map((mockVenue) => (
              <div key={mockVenue.id} className="w-72 shrink-0 sm:w-80">
                <VenueCard venue={mockVenue} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(RelatedVenueCarousel);
