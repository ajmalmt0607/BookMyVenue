const VenueMap = ({
  latitude,
  longitude,
}) => {

  const mapUrl =
    `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <section className="mt-12">

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        Location
      </h2>

      <iframe
        title="venue-map"
        src={mapUrl}
        width="100%"
        height="350"
        className="
          rounded-3xl
          border
        "
      />

    </section>
  );
};

export default VenueMap;