import { memo } from "react";

const VenueDescription = ({ description }) => {
  if (!description) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">About This Venue</h2>
      <p className="mt-4 leading-8 text-gray-600">{description}</p>
    </section>
  );
};

export default memo(VenueDescription);
