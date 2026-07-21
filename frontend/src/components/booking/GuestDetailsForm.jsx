import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User } from "lucide-react";

import InputField from "../ui/InputField";
import { guestDetailsSchema } from "../../validations/bookingValidation";

const CONSENT_ITEMS = [
  {
    name: "terms",
    label: "I agree to the Terms & Conditions",
  },
  {
    name: "cancellation",
    label: "I acknowledge the Cancellation Policy",
  },
  {
    name: "houseRules",
    label: "I acknowledge the venue's House Rules",
  },
  {
    name: "privacy",
    label: "I acknowledge the Privacy Policy",
  },
];

const GuestDetailsForm = ({
  formId,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      alternate_phone_number: "",
      special_requirements: "",
      arrival_notes: "",
      event_notes: "",
      terms: false,
      cancellation: false,
      houseRules: false,
      privacy: false,
    },
  });

  const submit = (data) => {
    const {
      terms,
      cancellation,
      houseRules,
      privacy,
      ...bookingFields
    } = data;

    // The 4 checkboxes are a client-side UX gate - the backend persists
    // a single terms_accepted_at timestamp, not 4 separate flags.
    onSubmit({
      ...bookingFields,
      terms_accepted: Boolean(
        terms && cancellation && houseRules && privacy
      ),
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(submit)}
      className="space-y-8"
      noValidate
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900">Guest Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Who should the venue expect on the day of the event?
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <InputField
              icon={<User size={18} />}
              placeholder="Primary Guest Name"
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <InputField
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <InputField
              icon={<Phone size={18} />}
              placeholder="Phone Number"
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          <div>
            <InputField
              icon={<Phone size={18} />}
              placeholder="Alternate Phone Number (optional)"
              {...register("alternate_phone_number")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Special Request
          </label>
          <textarea
            {...register("special_requirements")}
            rows={3}
            placeholder="Anything the venue should know in advance?"
            className="
              w-full rounded-xl border border-gray-200 bg-gray-50 p-4
              text-sm outline-none transition-all
              focus:border-red-500 focus:bg-white
            "
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Arrival Notes
          </label>
          <textarea
            {...register("arrival_notes")}
            rows={2}
            placeholder="Expected arrival time, vehicle/parking details, etc."
            className="
              w-full rounded-xl border border-gray-200 bg-gray-50 p-4
              text-sm outline-none transition-all
              focus:border-red-500 focus:bg-white
            "
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Event Notes
          </label>
          <textarea
            {...register("event_notes")}
            rows={2}
            placeholder="Tell the venue a bit about the event"
            className="
              w-full rounded-xl border border-gray-200 bg-gray-50 p-4
              text-sm outline-none transition-all
              focus:border-red-500 focus:bg-white
            "
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-6">
        {CONSENT_ITEMS.map((item) => (
          <div key={item.name}>
            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                {...register(item.name)}
                className="mt-0.5 h-4 w-4 accent-red-600"
              />
              <span>{item.label}</span>
            </label>
            {errors[item.name] && (
              <p className="mt-1 ml-7 text-sm text-red-500">
                {errors[item.name].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default GuestDetailsForm;
