import { useMemo, useRef, useState } from "react";
import { Search, X, Check } from "lucide-react";

import useClickOutside from "../../../hooks/useClickOutside";
import usePopoverPosition from "../../../hooks/usePopoverPosition";
import PopoverPortal from "../../ui/PopoverPortal";

const AmenityMultiSelect = ({ options, selectedIds, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef(null);
  const panelRef = useRef(null);

  useClickOutside([containerRef, panelRef], () => setIsOpen(false));
  const position = usePopoverPosition(containerRef, isOpen);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;

    const lower = query.toLowerCase();

    return options.filter((option) =>
      option.name.toLowerCase().includes(lower)
    );
  }, [options, query]);

  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id)
  );

  const toggle = (id) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((existingId) => existingId !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`
            flex h-12 w-full items-center gap-2 rounded-xl border
            bg-gray-50 px-4 text-left text-sm text-gray-500
            transition-all duration-200 ease-out
            hover:border-red-300
            focus:outline-none
            ${isOpen ? "border-red-500 ring-4 ring-red-100" : "border-gray-200"}
          `}
        >
          <Search size={16} className="shrink-0 text-gray-400" />
          {selectedOptions.length > 0
            ? `${selectedOptions.length} amenities selected`
            : "Search and select amenities..."}
        </button>

        <PopoverPortal
          position={position}
          panelRef={panelRef}
          matchWidth
          className="z-9999"
        >
          <div
            className={`
              origin-top rounded-2xl border border-gray-100 bg-white
              shadow-xl transition-all duration-150 ease-out
              ${
                isOpen
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }
            `}
          >
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search amenities..."
                  className="
                    h-10 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-sm
                    outline-none transition-colors duration-150
                    focus:bg-white focus:ring-2 focus:ring-red-100
                  "
                />
              </div>
            </div>

            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {filteredOptions.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-400">
                  No amenities found
                </li>
              )}

              {filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);

                return (
                  <li
                    key={option.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggle(option.id)}
                    className={`
                      flex cursor-pointer items-center justify-between
                      px-4 py-2.5 text-sm transition-colors duration-100
                      hover:bg-red-50
                      ${
                        isSelected
                          ? "font-semibold text-red-600"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {option.name}
                    {isSelected && <Check size={16} className="text-red-600" />}
                  </li>
                );
              })}
            </ul>
          </div>
        </PopoverPortal>
      </div>

      {selectedOptions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="
                flex items-center gap-1.5 rounded-full bg-red-50 py-1.5
                pl-3 pr-2 text-sm font-medium text-red-700
              "
            >
              {option.name}

              <button
                type="button"
                onClick={() => toggle(option.id)}
                aria-label={`Remove ${option.name}`}
                className="rounded-full p-0.5 transition-colors hover:bg-red-100"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmenityMultiSelect;
