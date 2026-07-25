import { useState } from "react";
import { Clock, IndianRupee, Plus, Trash2, Users } from "lucide-react";

import WizardFooter from "../WizardFooter";

import {
  createVenueTimeSlot,
  deleteVenueTimeSlot,
  updateVenueTimeSlot,
} from "../../../../services/venueDraftService";
import useSavedFlash from "../../../../hooks/useSavedFlash";

const EMPTY_SLOT = {
  name: "",
  start_time: "",
  end_time: "",
  price: "",
  max_guests: "",
};

const extractErrorMessage = (error, fallback) =>
  error?.response?.data?.non_field_errors?.[0] ||
  error?.response?.data?.end_time?.[0] ||
  error?.response?.data?.message ||
  fallback;

const TimeSlotsStep = ({ venue, venueId, onBack, onContinue }) => {
  const [slots, setSlots] = useState(venue?.time_slots || []);
  const [draft, setDraft] = useState(EMPTY_SLOT);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { justSaved, flash } = useSavedFlash();

  const hasActiveSlot = slots.some((slot) => slot.is_active !== false);

  const handleAdd = async () => {
    if (!draft.name || !draft.start_time || !draft.end_time || !draft.price) {
      setError("Fill in name, start time, end time, and price.");
      return;
    }

    if (draft.start_time >= draft.end_time) {
      setError("Start time must be before end time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const created = await createVenueTimeSlot(venueId, {
        name: draft.name,
        start_time: draft.start_time,
        end_time: draft.end_time,
        price: draft.price,
        max_guests: draft.max_guests || null,
      });

      setSlots((prev) => [...prev, created]);
      setDraft(EMPTY_SLOT);
      setIsAdding(false);
      flash();
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't add that time slot."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId) => {
    const previous = slots;

    setSlots((current) => current.filter((slot) => slot.id !== slotId));

    try {
      await deleteVenueTimeSlot(venueId, slotId);
      flash();
    } catch (err) {
      console.error(err);
      setSlots(previous);
      setError("Couldn't delete that time slot.");
    }
  };

  const handleToggleActive = async (slot) => {
    const previous = slots;

    setSlots((current) =>
      current.map((s) =>
        s.id === slot.id ? { ...s, is_active: !s.is_active } : s
      )
    );

    try {
      await updateVenueTimeSlot(venueId, slot.id, {
        is_active: !slot.is_active,
      });
      flash();
    } catch (err) {
      setSlots(previous);
      setError(extractErrorMessage(err, "Couldn't update that time slot."));
    }
  };

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Set your time slots
          </h2>
          <p className="mt-1.5 text-gray-500">
            Define the bookable slots for your venue. At least one active
            slot is required.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="rounded-2xl border border-gray-100 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">
                    {slot.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock size={14} />
                    {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(slot.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="flex items-center gap-1 font-bold text-gray-900">
                  <IndianRupee size={14} />
                  {Number(slot.price).toLocaleString()}
                </p>

                {slot.max_guests && (
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <Users size={14} />
                    Up to {slot.max_guests}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleActive(slot)}
                  className={`
                    rounded-full px-3 py-1 text-xs font-semibold
                    transition-colors duration-200
                    ${
                      slot.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                >
                  {slot.is_active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}

          {isAdding ? (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-5">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, name: event.target.value }))
                  }
                  placeholder="Slot name (e.g. Evening)"
                  className="
                    col-span-2 h-10 rounded-lg border border-gray-200
                    bg-white px-3 text-sm outline-none
                    focus:border-red-500
                  "
                />

                <input
                  type="time"
                  value={draft.start_time}
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, start_time: event.target.value }))
                  }
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-red-500"
                />

                <input
                  type="time"
                  value={draft.end_time}
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, end_time: event.target.value }))
                  }
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-red-500"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, price: event.target.value }))
                  }
                  placeholder="Price"
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-red-500"
                />

                <input
                  type="number"
                  min="1"
                  value={draft.max_guests}
                  onChange={(event) =>
                    setDraft((d) => ({ ...d, max_guests: event.target.value }))
                  }
                  placeholder="Max guests (optional)"
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleAdd}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? "Adding..." : "Add Slot"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setDraft(EMPTY_SLOT);
                    setError("");
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition-colors duration-200 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="
                flex min-h-[140px] flex-col items-center justify-center gap-2
                rounded-2xl border-2 border-dashed border-gray-200 text-gray-400
                transition-colors duration-200
                hover:border-red-300 hover:text-red-500
              "
            >
              <Plus size={22} />
              <span className="text-sm font-semibold">Add Time Slot</span>
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <WizardFooter
        onBack={onBack}
        justSaved={justSaved}
        continueDisabled={!hasActiveSlot}
        onContinue={() => onContinue({ time_slots: slots })}
      />
    </div>
  );
};

export default TimeSlotsStep;
