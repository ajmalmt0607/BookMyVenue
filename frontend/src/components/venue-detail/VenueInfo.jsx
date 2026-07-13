import { memo } from "react";
import { Building2, MapPin, Star, Users } from "lucide-react";

const VenueInfo = ({ venue }) => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
      {venue.name}
    </h1>

    <div className="mt-3 flex items-center gap-1.5 font-medium text-red-600">
      <MapPin size={17} className="shrink-0" />
      <span>
        {[venue.city, venue.district, venue.state].filter(Boolean).join(", ")}
      </span>
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-600">
      <div className="flex items-center gap-2">
        <Star size={17} className="fill-red-600 text-red-600" />
        <span className="font-semibold text-gray-900">{venue.rating}</span>
        <span className="text-sm text-gray-500">
          ({venue.total_reviews} reviews)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Users size={17} className="text-red-600" />
        <span>
          {venue.min_capacity} – {venue.max_capacity} Guests
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Building2 size={17} className="text-red-600" />
        <span>{venue.venue_type}</span>
      </div>
    </div>
  </div>
);

export default memo(VenueInfo);
