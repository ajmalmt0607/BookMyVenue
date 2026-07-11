import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, MapPin } from "lucide-react";

import { VENUE_TYPE_OPTIONS } from "../../constants/venueTypes";

const GUEST_OPTIONS = [50, 100, 250, 500, 1000];

const FILTER_KEYS = ["location", "venue_type", "guests"];

const readDraft = (searchParams) => ({
  location: searchParams.get("location") || "",
  venue_type: searchParams.get("venue_type") || "",
  guests: searchParams.get("guests") || "",
});

// Single component used for both desktop and mobile: a trigger button plus
// a portal-rendered bottom-sheet (full-width sheet on mobile, a centered
// bottom-anchored modal on larger screens).
const VenueFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);
  const [draft, setDraft] = useState(() => readDraft(searchParams));

  // Sync the draft from the applied filters each time the sheet opens.
  // Done during render (rather than an effect) so it lands before the
  // open paint, matching the pattern used by the search-card popovers.
  if (isOpen !== wasOpen) {
    
    setWasOpen(isOpen);

    if (isOpen) {
      setDraft(readDraft(searchParams));
    }
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeCount = FILTER_KEYS.filter((key) =>
    searchParams.get(key)
  ).length;

  const toggleDraftValue = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key] === String(value) ? "" : String(value),
    }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    FILTER_KEYS.forEach((key) => {
      if (draft[key]) params.set(key, draft[key]);
      else params.delete(key);
    });

    params.set("page", 1);
    setSearchParams(params);
    setIsOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams);

    FILTER_KEYS.forEach((key) => params.delete(key));
    params.set("page", 1);

    setSearchParams(params);
    setDraft({ location: "", venue_type: "", guests: "" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          flex h-12 items-center gap-2 rounded-xl border border-gray-200
          bg-white px-5 text-sm font-semibold text-gray-700 shrink-0
          transition-all duration-200 ease-out
          hover:border-red-300 hover:shadow-sm
        "
      >
        <SlidersHorizontal size={16} className="text-red-600" />
        Filters
        {activeCount > 0 && (
          <span
            className="
              flex h-5 min-w-5 items-center justify-center rounded-full
              bg-red-600 px-1 text-xs font-bold text-white
            "
          >
            {activeCount}
          </span>
        )}
      </button>

      {createPortal(
        <div
          className={`fixed inset-0 z-9999 ${
            isOpen ? "" : "pointer-events-none"
          }`}
        >
          <div
            onClick={() => setIsOpen(false)}
            className={`
              absolute inset-0 bg-black/50
              transition-opacity duration-200 ease-out
              ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
            `}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter venues"
            className={`
              absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-2xl
              max-h-[85vh] flex-col overflow-hidden
              rounded-t-3xl bg-white shadow-2xl
              sm:bottom-6 sm:rounded-3xl
              transition-[transform,opacity] duration-200 ease-out
              ${
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-full opacity-0"
              }
            `}
          >
            <div className="flex justify-center pt-2.5 sm:hidden">
              <span className="h-1.5 w-10 rounded-full bg-gray-300" />
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close filters"
                className="
                  flex h-9 w-9 items-center justify-center rounded-full
                  text-gray-500 transition-colors duration-200
                  hover:bg-gray-100
                "
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <div>
                <h3 className="mb-3 text-sm font-bold text-gray-900">
                  Location
                </h3>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600"
                  />

                  <input
                    type="text"
                    value={draft.location}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                    placeholder="Search city or location"
                    className="
                      h-12 w-full rounded-2xl border border-gray-200
                      pl-11 pr-4 outline-none
                      transition-all duration-200 ease-out
                      focus:border-red-500 focus:ring-4 focus:ring-red-100
                    "
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-gray-900">
                  Venue Type
                </h3>

                <div className="flex flex-wrap gap-2">
                  {VENUE_TYPE_OPTIONS.filter((option) => option.value).map(
                    (option) => {
                      const Icon = option.icon;
                      const isSelected = draft.venue_type === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            toggleDraftValue("venue_type", option.value)
                          }
                          className={`
                            flex items-center gap-2 rounded-full border
                            px-4 py-2.5 text-sm font-medium
                            transition-all duration-200 ease-out
                            ${
                              isSelected
                                ? "border-red-600 bg-red-600 text-white shadow-sm"
                                : "border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50"
                            }
                          `}
                        >
                          <Icon
                            size={15}
                            className={
                              isSelected ? "text-white" : "text-red-600"
                            }
                          />
                          {option.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-gray-900">
                  Capacity
                </h3>

                <div className="flex flex-wrap gap-2">
                  {GUEST_OPTIONS.map((guests) => {
                    const isSelected = draft.guests === String(guests);

                    return (
                      <button
                        key={guests}
                        type="button"
                        onClick={() => toggleDraftValue("guests", guests)}
                        className={`
                          rounded-full border px-4 py-2.5 text-sm font-medium
                          transition-all duration-200 ease-out
                          ${
                            isSelected
                              ? "border-red-600 bg-red-600 text-white shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50"
                          }
                        `}
                      >
                        {guests}+ Guests
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={handleReset}
                className="
                  flex-1 rounded-xl border border-gray-200 py-3
                  text-sm font-semibold text-gray-700
                  transition-all duration-200 ease-out
                  hover:border-gray-300 hover:bg-gray-50
                "
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="
                  flex-1 rounded-xl bg-red-600 py-3
                  text-sm font-semibold text-white
                  transition-all duration-200 ease-out
                  hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
                "
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default VenueFilters;
