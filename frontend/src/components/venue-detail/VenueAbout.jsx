const VenueAbout = ({ description }) => {
  return (
    <section className="mt-12">

      <h2
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        About This Venue
      </h2>

      <p
        className="
          text-gray-600
          leading-8
        "
      >
        {description}
      </p>

    </section>
  );
};

export default VenueAbout;