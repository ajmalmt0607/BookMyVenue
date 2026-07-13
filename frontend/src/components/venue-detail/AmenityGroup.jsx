import { memo, useMemo } from "react";

import { categorizeAmenities } from "../../constants/amenityCategories";

const AmenityGroup = ({ amenities = [] }) => {
  // Categorization still drives which icon each amenity gets, it's just no
  // longer rendered as separate labeled sections — a flat chip list reads
  // cleaner for the amount of amenities most venues have.
  const groups = useMemo(() => categorizeAmenities(amenities), [amenities]);

  if (!groups.length) return null;

  return (
    <div className="flex flex-wrap gap-2.5">
      {groups.map((group) => {
        const GroupIcon = group.icon;

        return group.items.map((amenity) => (
          <span
            key={amenity.id}
            className="
              inline-flex items-center gap-2 rounded-full border
              border-gray-200 bg-white px-4 py-2
              text-sm font-medium text-gray-700
              transition-colors duration-200 ease-out
              hover:border-red-300 hover:bg-red-50
            "
          >
            <GroupIcon size={14} className="text-red-600" />
            {amenity.name}
          </span>
        ));
      })}
    </div>
  );
};

export default memo(AmenityGroup);
