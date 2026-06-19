import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  MapPin,
  Users,
  Star,
} from "lucide-react";

const VenueCard = ({ venue }) => {

  return (
    <Link
      className="
        bg-white
        overflow-hidden
        transition-all
        duration-300
        cursor-pointer
        group
      "
    >
      {/* Image */}

      <div className="relative rounded-2xl overflow-hidden">

        <img
          src={`http://localhost:8011${venue.image}`}
          alt={venue.name}
          className="
            h-50
            w-full
            object-cover
            group-hover:scale-105
            transition-all
            duration-500
          "
        />

        <div
          className="
            absolute
            top-3
            left-3
            bg-red-500
            text-white
            text-xs
            font-semibold
            px-3
            py-1
            rounded
          "
        >
          {venue.venue_type}
        </div>

      </div>

      {/* Content */}

      <div className="p-4">

        <div
          className="
            flex
            justify-between
            items-start
            gap-2
          "
        >
          <h3
            className="
              font-bold
              text-lg
              text-gray-900
              line-clamp-1
            "
          >
            {venue.name}
          </h3>

          <div
            className="
              flex
              items-center
              gap-1
            "
          >
            <Star
              size={16}
              fill="#ef4444"
              className="text-red-500"
            />

            <span
              className="
                text-sm
                font-medium
              "
            >
              {venue.rating}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
            {/* Location */}
            <div
            className="
                flex
                items-center
                gap-2
                mt-3
                text-gray-500
            "
            >
            <MapPin
                size={16}
                className="text-red-500"
            />

            <span className="text-sm">
                {venue.city}
            </span>
            </div>

            {/* Capacity */}

            <div
            className="
                flex
                items-center
                gap-2
                mt-3
                text-gray-500
            "
            >
            <Users
                size={16}
                className="text-red-500"
            />

                <span className="text-sm">
                    {/* {venue.min_capacity}
                    {" - "} */}
                    {venue.max_capacity}
                    {" Guests"}
                </span>
            </div>
        </div>

        {/* Price */}

        <div
          className="
            mt-4
            pt-4
            border-t
            border-gray-100
            flex
            justify-between
            items-center
          "
        >
          <div>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Starting from
            </p>

            <h4
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              ₹{Number(
                venue.price_per_day
              ).toLocaleString()}
            </h4>

          </div>

            <Link
            to={`/venues/${venue.slug}`}
            className="
                block
                text-center
                text-sm
                py-2
                px-3
                border
                rounded-xl
                text-white
                bg-red-600
                hover:bg-red-500
            "
            >
            View Details
            </Link>
        </div>

      </div>
    </Link>
  );
};

export default VenueCard;