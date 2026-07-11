import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Star, ArrowUpRight } from "lucide-react";

import VenueImageCarousel from "./VenueImageCarousel";
import WishlistButton from "./WishlistButton";

const VenueCard = ({ venue }) => {
  const images = useMemo(
    () =>
      venue.images?.length
        ? venue.images
        : venue.image
          ? [venue.image]
          : [],
    [venue.images, venue.image]
  );

  return (
    <Link
      to={`/venues/${venue.slug}`}
      className="
        group flex flex-col overflow-hidden rounded-3xl
        bg-white border border-gray-100
        transition-[box-shadow,border-color] duration-200 ease-out
        hover:border-gray-200 hover:shadow-lg
      "
    >
      <div className="relative">
        <VenueImageCarousel images={images} alt={venue.name} />

        <div
          className="
            absolute top-3 left-3 z-10
            flex items-center gap-1.5 rounded-full
            bg-white/95 px-3 py-1.5
            text-xs font-semibold text-gray-800 shadow-sm
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          {venue.venue_type}
        </div>

        <WishlistButton className="absolute top-3 right-3 z-10" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
            {venue.name}
          </h3>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1">
            <Star size={13} className="fill-red-600 text-red-600" />
            <span className="text-xs font-semibold text-gray-800">
              {venue.rating}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin size={15} className="shrink-0 text-red-600" />
            <span className="truncate">{venue.city}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users size={15} className="shrink-0 text-red-600" />
            <span>Up to {venue.max_capacity} guests</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-5">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>

            <p className="text-xl font-bold text-gray-900">
              ₹{Number(venue.price_per_day).toLocaleString()}
              <span className="text-xs font-medium text-gray-400"> / day</span>
            </p>
          </div>

          <span
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full border border-gray-200 text-gray-400
              transition-[background-color,border-color,color] duration-200 ease-out
              group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white
            "
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default memo(VenueCard);
