import { useEffect, useRef, useState } from "react";
import { Users, Minus, Plus } from "lucide-react";

import useClickOutside from "../../hooks/useClickOutside";
import usePopoverPosition from "../../hooks/usePopoverPosition";
import PopoverPortal from "../ui/PopoverPortal";

const GuestSelector = ({
  value,
  onChange,
  min = 1,
  max = 5000,
  placeholder = "Add guests",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  useClickOutside([containerRef, panelRef], () => setIsOpen(false));

  const position = usePopoverPosition(containerRef, isOpen);

  const numericValue = Number(value) || 0;

  const clamp = (n) => Math.min(max, Math.max(min, n));

  const increment = () => onChange(String(clamp((numericValue || min - 1) + 1)));

  const decrement = () => onChange(String(clamp((numericValue || min + 1) - 1)));

  const handleInputChange = (event) => {
    const raw = event.target.value.replace(/[^\d]/g, "");

    if (raw === "") {
      onChange("");
      return;
    }

    onChange(String(clamp(Number(raw))));
  };

  const handleInputBlur = () => {
    if (value && Number(value) < min) {
      onChange(String(min));
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="dialog"
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
        <Users size={18} className="text-red-600 shrink-0" />

        <span
          className={`flex-1 truncate font-medium ${
            value ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {value ? `${value} Guest${Number(value) === 1 ? "" : "s"}` : placeholder}
        </span>
      </button>

      <PopoverPortal position={position} panelRef={panelRef} className="z-9999">
        <div
          role="dialog"
          aria-label="Select number of guests"
          className={`
            w-65
            bg-white rounded-2xl shadow-xl border border-gray-100 p-5
            origin-top transition-all duration-200 ease-out
            ${
              isOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">Guests</span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrement}
                disabled={numericValue <= min}
                aria-label="Decrease guests"
                className="
                  h-9 w-9 flex items-center justify-center rounded-full
                  border border-gray-300 text-gray-600
                  transition-all duration-150
                  hover:border-red-500 hover:text-red-600
                  disabled:opacity-30 disabled:cursor-not-allowed
                  disabled:hover:border-gray-300 disabled:hover:text-gray-600
                "
              >
                <Minus size={16} />
              </button>

              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder={String(min)}
                className="w-12 text-center font-semibold text-gray-800 outline-none"
              />

              <button
                type="button"
                onClick={increment}
                disabled={numericValue >= max}
                aria-label="Increase guests"
                className="
                  h-9 w-9 flex items-center justify-center rounded-full
                  border border-gray-300 text-gray-600
                  transition-all duration-150
                  hover:border-red-500 hover:text-red-600
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </PopoverPortal>
    </div>
  );
};

export default GuestSelector;
