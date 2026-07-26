import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, SearchX } from "lucide-react";

import useClickOutside from "../../hooks/useClickOutside";
import useDebounce from "../../hooks/useDebounce";
import usePopoverPosition from "../../hooks/usePopoverPosition";
import PopoverPortal from "../ui/PopoverPortal";
import { searchLocations } from "../../services/locationService";

const LocationSearch = ({
  value,
  onChange,
  onSelectLocation,
  placeholder = "Search city or location",
  fetchLocations = searchLocations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [prevValue, setPrevValue] = useState(value);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const requestIdRef = useRef(0);

  const debouncedQuery = useDebounce(query, 400);

  useClickOutside([containerRef, panelRef], () => setIsOpen(false));

  const showPanel = isOpen && query.trim().length >= 2;

  const position = usePopoverPosition(containerRef, showPanel);

  // Keep the local text in sync when the parent resets `value` externally
  // (e.g. clearing the form). Done during render, not an effect, since this
  // only needs to react to the prop actually changing.
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value || "");
  }

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 2) {
      requestIdRef.current += 1;
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    fetchLocations(trimmed)
      .then((data) => {
        if (requestId === requestIdRef.current) {
          setResults(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (requestId === requestIdRef.current) {
          setResults([]);
        }
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      });
  }, [debouncedQuery, fetchLocations]);

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    onChange(nextValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const selectLocation = (location) => {
    const label = location.location_name || location.full_address || "";
    setQuery(label);
    onChange(label);
    onSelectLocation?.(location);
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        event.preventDefault();
        selectLocation(results[highlightedIndex]);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <MapPin
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none"
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={showPanel}
        aria-autocomplete="list"
        autoComplete="off"
        className={`
          w-full h-16 pl-12 pr-4 border rounded-2xl outline-none
          transition-all duration-200 ease-out
          hover:border-red-300
          focus:ring-4 focus:ring-red-100
          ${isOpen ? "border-red-500 ring-4 ring-red-100" : "border-gray-200"}
        `}
      />

      <PopoverPortal
        position={position}
        panelRef={panelRef}
        matchWidth
        className="z-9999"
      >
        <div
          role="listbox"
          className={`
            bg-white rounded-2xl shadow-xl border border-gray-100
            overflow-hidden origin-top
            transition-all duration-200 ease-out
            ${
              showPanel
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
            }
          `}
        >
          {loading && (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin text-red-600" />
              Searching locations...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-sm text-gray-400">
              <SearchX size={20} />
              No locations found for &quot;{query}&quot;
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-64 overflow-y-auto py-1">
              {results.map((location, index) => (
                <li
                  key={`${location.location_name}-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectLocation(location)}
                  className={`
                    flex items-start gap-3 px-4 py-2.5 cursor-pointer text-sm
                    transition-colors duration-100
                    ${index === highlightedIndex ? "bg-red-50" : ""}
                  `}
                >
                  <MapPin
                    size={16}
                    className="text-red-600 mt-0.5 shrink-0"
                  />

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-gray-800 truncate">
                      {location.location_name}
                    </span>

                    {location.full_address && (
                      <span className="text-xs text-gray-400 truncate">
                        {location.full_address}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverPortal>
    </div>
  );
};

export default LocationSearch;
