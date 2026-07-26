import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  MapPin,
  Landmark,
  Users,
} from "lucide-react";

import InputField from "../../../ui/InputField";
import WizardFooter from "../WizardFooter";

import { basicInfoSchema } from "../../../../validations/venueWizardValidation";
import { getVenueTypes } from "../../../../services/venueService";
import { updateVenueBasicInfo } from "../../../../services/venueDraftService";
import useStepSave from "../../../../hooks/useStepSave";

const FIELD_KEYS = [
  "venue_type_id",
  "name",
  "description",
  "venue_address",
  "location_name",
  "location_address",
  "city",
  "state",
  "country",
  "min_capacity",
  "max_capacity",
];

const toFormValues = (venue) => ({
  venue_type_id: venue?.venue_type_id || "",
  name: venue?.name || "",
  description: venue?.description || "",
  venue_address: venue?.venue_address || "",
  location_name: venue?.location_name || "",
  location_address: venue?.location_address || "",
  city: venue?.city || "",
  state: venue?.state || "",
  country: venue?.country || "India",
  min_capacity: venue?.min_capacity ?? "",
  max_capacity: venue?.max_capacity ?? "",
});

const Field = ({ label, error, children, className = "" }) => (
  <div className={className}>
    <label className="mb-1 block text-sm font-semibold text-gray-700">
      {label}
    </label>

    {children}

    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

const BasicInfoStep = ({ venue, venueId, onBack, onContinue }) => {
  const [venueTypes, setVenueTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const { saving, justSaved, save } = useStepSave(onContinue);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    values: toFormValues(venue),
  });

  useEffect(() => {
    let isMounted = true;

    getVenueTypes()
      .then((data) => {
        if (isMounted) setVenueTypes(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingTypes(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async (data) => {
    const payload = FIELD_KEYS.reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    try {
      await save(() => updateVenueBasicInfo(venueId, payload));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form
        id="basic-info-form"
        onSubmit={handleSubmit(submit)}
        noValidate
        className="space-y-5"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Tell us about your venue
          </h2>
          <p className="mt-1.5 text-gray-500">
            The essentials customers see first - you can refine everything
            later.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Venue Type" error={errors.venue_type_id}>
            <div className="relative">
              <Building2
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                {...register("venue_type_id")}
                disabled={loadingTypes}
                className="
                  h-12 w-full appearance-none rounded-xl border border-gray-200
                  bg-gray-50 pl-12 pr-4 text-sm outline-none transition-all
                  focus:border-red-500 focus:bg-white
                "
              >
                <option value="">
                  {loadingTypes ? "Loading..." : "Select a venue type"}
                </option>

                {venueTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Venue Name" error={errors.name}>
            <InputField
              icon={<Building2 size={18} />}
              placeholder="e.g. Grand Palace Banquet Hall"
              {...register("name")}
            />
          </Field>
        </div>

        <Field label="Description" error={errors.description}>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Describe what makes this venue special..."
            className="
              w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm
              outline-none transition-all focus:border-red-500 focus:bg-white
            "
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="State" error={errors.state}>
            <InputField
              icon={<MapPin size={18} />}
              placeholder="e.g. Maharashtra"
              {...register("state")}
            />
          </Field>

          <Field label="Country" error={errors.country}>
            <InputField
              icon={<MapPin size={18} />}
              placeholder="e.g. India"
              {...register("country")}
            />
          </Field>

          <Field label="City" error={errors.city}>
            <InputField
              icon={<Landmark size={18} />}
              placeholder="e.g. Mumbai"
              {...register("city")}
            />
          </Field>

          <Field label="Area" error={errors.location_name}>
            <InputField
              icon={<MapPin size={18} />}
              placeholder="e.g. Bandra West"
              {...register("location_name")}
            />
          </Field>
        </div>

        <Field label="Full Address" error={errors.venue_address}>
          <textarea
            {...register("venue_address")}
            rows={2}
            placeholder="Street, building, landmark..."
            className="
              w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm
              outline-none transition-all focus:border-red-500 focus:bg-white
            "
          />
        </Field>

        <Field label="Location Address" error={errors.location_address}>
          <InputField
            icon={<MapPin size={18} />}
            placeholder="A detailed address customers will see on the map"
            {...register("location_address")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Min Capacity" error={errors.min_capacity}>
            <InputField
              icon={<Users size={18} />}
              type="number"
              min="1"
              placeholder="50"
              {...register("min_capacity", { valueAsNumber: true })}
            />
          </Field>

          <Field label="Max Capacity" error={errors.max_capacity}>
            <InputField
              icon={<Users size={18} />}
              type="number"
              min="1"
              placeholder="300"
              {...register("max_capacity", { valueAsNumber: true })}
            />
          </Field>
        </div>
      </form>

      <WizardFooter
        onBack={onBack}
        saving={saving}
        justSaved={justSaved}
        continueDisabled={justSaved}
        onContinue={handleSubmit(submit)}
      />
    </div>
  );
};

export default BasicInfoStep;
