import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

import useClickOutside from "../../hooks/useClickOutside";
import usePopoverPosition from "../../hooks/usePopoverPosition";
import PopoverPortal from "../ui/PopoverPortal";

const VenueTypeDropdown = ({
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const panelRef = useRef(null);

  useClickOutside([containerRef, panelRef], () => setIsOpen(false));

  const position = usePopoverPosition(containerRef, isOpen);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;

    const lower = query.toLowerCase();

    return options.filter((option) =>
      option.label.toLowerCase().includes(lower)
    );
  }, [options, query]);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  // Reset the search text and highlight when the panel opens. Done during
  // render (rather than an effect) so it lands before the open paint.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      setQuery("");
      const selectedIndex = options.findIndex(
        (option) => option.value === value
      );
      setHighlightedIndex(Math.max(selectedIndex, 0));
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setHighlightedIndex(0);
  };

  const selectOption = (option) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (
      !isOpen &&
      ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)
    ) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleListKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) =>
        Math.min(index + 1, filteredOptions.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) selectOption(option);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  const SelectedIcon = selectedOption.icon;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          w-full h-16 flex items-center gap-3 px-4
          border rounded-2xl bg-white text-left cursor-pointer
          transition-all duration-200 ease-out
          hover:border-red-300 hover:shadow-sm
          focus:outline-none focus:ring-4 focus:ring-red-100
          ${isOpen ? "border-red-500 ring-4 ring-red-100" : "border-gray-200"}
        `}
      >
        <SelectedIcon size={18} className="text-red-600 shrink-0" />

        <span className="flex-1 truncate font-medium text-gray-800">
          {selectedOption.label}
        </span>

        <ChevronDown
          size={18}
          className={`
            text-gray-400 transition-transform duration-200 shrink-0
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

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
              isOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
            }
          `}
        >
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleListKeyDown}
                placeholder="Search venue type..."
                className="
                  w-full h-10 pl-9 pr-3 rounded-xl bg-gray-50 text-sm
                  outline-none transition-colors duration-150
                  focus:bg-white focus:ring-2 focus:ring-red-100
                "
              />
            </div>
          </div>

          <ul className="max-h-64 overflow-y-auto py-1">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">
                No venue types found
              </li>
            )}

            {filteredOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value || "all"}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm
                    transition-colors duration-100
                    ${isHighlighted ? "bg-red-50" : ""}
                    ${isSelected ? "text-red-600 font-semibold" : "text-gray-700"}
                  `}
                >
                  <Icon
                    size={16}
                    className={isSelected ? "text-red-600" : "text-gray-400"}
                  />

                  <span className="flex-1">{option.label}</span>

                  {isSelected && <Check size={16} className="text-red-600" />}
                </li>
              );
            })}
          </ul>
        </div>
      </PopoverPortal>
    </div>
  );
};

export default VenueTypeDropdown;
