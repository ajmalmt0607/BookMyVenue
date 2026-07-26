import { useState } from "react";
import { MapPin, Users, IndianRupee } from "lucide-react";

import WizardFooter from "../WizardFooter";

import {
  POLICY_ICON_MAP,
  DEFAULT_POLICY_ICON,
} from "../../../../constants/policyIcons";
import { submitVenueForApproval } from "../../../../services/venueDraftService";

const SummaryCard = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6">
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400">
      {title}
    </h3>
    {children}
  </div>
);

const ReviewStep = ({ venue, venueId, onBack, onSubmitted }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(null);

  const primaryImage =
    venue?.images?.find((image) => image.is_primary) || venue?.images?.[0];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setErrors(null);

      const updated = await submitVenueForApproval(venueId);

      onSubmitted(updated);
    } catch (err) {
      setErrors(
        err?.response?.data?.errors || {
          submission: "Something went wrong. Please try again.",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Review &amp; Submit
          </h2>
          <p className="mt-1.5 text-gray-500">
            Take one last look before sending your venue for review.
          </p>
        </div>

        <SummaryCard title="Basic Information">
          <h4 className="text-lg font-bold text-gray-900">{venue?.name}</h4>
          <p className="mt-1 text-sm text-gray-600">{venue?.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-red-600" />
              {venue?.location_name}, {venue?.city}
            </span>

            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-red-600" />
              {venue?.min_capacity}-{venue?.max_capacity} guests
            </span>

            <span className="flex items-center gap-1.5 font-semibold text-gray-900">
              <IndianRupee size={15} className="text-red-600" />
              Starting from {Number(venue?.price_per_day || 0).toLocaleString()}
            </span>
          </div>
        </SummaryCard>

        <SummaryCard title="Primary Image">
          {primaryImage ? (
            <div className="overflow-hidden rounded-xl">
              <img
                src={primaryImage.image}
                alt=""
                className="h-56 w-full object-cover"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400">No image uploaded.</p>
          )}
        </SummaryCard>

        <SummaryCard title="Amenities">
          {venue?.amenities?.length ? (
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map((amenity) => (
                <span
                  key={amenity.id}
                  className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
                >
                  {amenity.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No amenities selected.</p>
          )}
        </SummaryCard>

        <SummaryCard title="Policies">
          {venue?.policies?.length ? (
            <div className="space-y-3">
              {venue.policies.map((policy) => {
                const Icon =
                  POLICY_ICON_MAP[policy.policy_type?.icon] ||
                  DEFAULT_POLICY_ICON;

                return (
                  <div key={policy.id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <Icon size={14} />
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {policy.policy_type?.name}
                      </p>
                      <p className="text-sm text-gray-600">{policy.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No policies added.</p>
          )}
        </SummaryCard>

        <SummaryCard title="Time Slots">
          {venue?.time_slots?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {venue.time_slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {slot.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.start_time?.slice(0, 5)} -{" "}
                      {slot.end_time?.slice(0, 5)}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    ₹{Number(slot.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No time slots added.</p>
          )}
        </SummaryCard>

        {errors && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {Object.values(errors).map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        )}
      </div>

      <WizardFooter
        onBack={onBack}
        saving={submitting}
        continueLabel="Submit for Review"
        onContinue={handleSubmit}
      />
    </div>
  );
};

export default ReviewStep;
