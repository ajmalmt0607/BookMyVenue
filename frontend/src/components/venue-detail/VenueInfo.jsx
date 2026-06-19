import {
  MapPin,
  Users,
  Star,
  Building2,
} from "lucide-react";

const VenueInfo = ({
  venue,
}) => {

  return (
    <div className="mt-8">

      <h1
        className="
          text-4xl
          lg:text-5xl
          font-bold
          text-gray-900
        "
      >
        {venue.name}
      </h1>

      {/* Address */}

      <div
        className="
          flex
          items-center
          gap-2
          mt-4
          text-red-600
          font-medium
        "
      >
        <MapPin size={18} />

        <span>
          {venue.city},
          {" "}
          {venue.district},
          {" "}
          {venue.state}
        </span>

      </div>

      {/* Meta Info */}

      <div
        className="
          flex
          flex-wrap
          gap-8
          mt-6
          text-gray-600
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Star
            size={18}
            className="text-yellow-500"
          />

          <span>
            {venue.rating}
            {" "}
            Rating
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Users size={18} />

          <span>
            {venue.min_capacity}
            {" - "}
            {venue.max_capacity}
            {" "}
            Guests
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Building2 size={18} />

          <span>
            {venue.venue_type}
          </span>

        </div>

      </div>

    </div>
  );
};

export default VenueInfo;