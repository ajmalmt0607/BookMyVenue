import { memo } from "react";

import AmenityGroup from "./AmenityGroup";

const AmenitiesSection = ({ amenities = [] }) => {
  if (!amenities.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>

      <div className="mt-6">
        <AmenityGroup amenities={amenities} />
      </div>
    </section>
  );
};

export default memo(AmenitiesSection);
