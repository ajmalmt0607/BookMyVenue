import {
  Wifi,
  Car,
  Snowflake,
  ShieldCheck,
} from "lucide-react";

const VenueAmenities = ({
  amenities,
}) => {

  const getIcon = (name) => {

    const value =
      name.toLowerCase();

    if (value.includes("wifi"))
      return <Wifi size={22} />;

    if (value.includes("parking"))
      return <Car size={22} />;

    if (value.includes("ac"))
      return <Snowflake size={22} />;

    return (
      <ShieldCheck size={22} />
    );
  };

  return (
    <section className="mt-12">

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        Amenities
      </h2>

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
        "
      >

        {amenities.map(
          (amenity) => (
            <div
              key={amenity.id}
              className="
                border
                rounded-2xl
                p-5
                flex
                flex-col
                items-center
                gap-3
                hover:shadow-md
                transition-all
              "
            >

              <div
                className="
                  text-red-600
                "
              >
                {getIcon(
                  amenity.name
                )}
              </div>

              <p
                className="
                  font-medium
                "
              >
                {amenity.name}
              </p>

            </div>
          )
        )}

      </div>

    </section>
  );
};

export default VenueAmenities;