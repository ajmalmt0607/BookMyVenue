import VenueCard from "./VenueCard";

const VenueGrid = ({
  venues,
  loading,
}) => {

  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="
              h-[380px]
              rounded-2xl
              bg-gray-100
              animate-pulse
            "
          />
        ))}
      </div>
    );
  }

  if (!venues?.length) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          p-12
          text-center
        "
      >
        <h3
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          No Venues Found
        </h3>

        <p
          className="
            text-gray-500
            mt-3
          "
        >
          Try changing your filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >
      {venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
        />
      ))}
    </div>
  );
};

export default VenueGrid;