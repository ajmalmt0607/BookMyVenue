import { useEffect, useState } from "react";

import AmenityMultiSelect from "../AmenityMultiSelect";
import WizardFooter from "../WizardFooter";

import { getAmenities } from "../../../../services/venueService";
import { updateVenueAmenities } from "../../../../services/venueDraftService";
import useStepSave from "../../../../hooks/useStepSave";

const AmenitiesStep = ({ venue, venueId, onBack, onContinue }) => {
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [selectedIds, setSelectedIds] = useState(
    (venue?.amenities || []).map((amenity) => amenity.id)
  );

  const { saving, justSaved, save } = useStepSave((amenities) =>
    onContinue({ amenities })
  );

  useEffect(() => {
    let isMounted = true;

    getAmenities()
      .then((data) => {
        if (isMounted) setOptions(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingOptions(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContinue = async () => {
    try {
      await save(() => updateVenueAmenities(venueId, selectedIds));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            What does your venue offer?
          </h2>
          <p className="mt-1.5 text-gray-500">
            Select all the amenities that apply. It's fine to skip this if
            none apply.
          </p>
        </div>

        {loadingOptions ? (
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
        ) : (
          <AmenityMultiSelect
            options={options}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
        )}
      </div>

      <WizardFooter
        onBack={onBack}
        saving={saving}
        justSaved={justSaved}
        continueDisabled={justSaved}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default AmenitiesStep;
