const VenueGallery = ({
  images,
}) => {

  const image =
    images?.[0]?.image;

  return (
    <div>

      <img
        src={image}
        alt=""
        className="
          w-full
          h-[500px]
          object-cover
          rounded-3xl
        "
      />

    </div>
  );
};

export default VenueGallery;