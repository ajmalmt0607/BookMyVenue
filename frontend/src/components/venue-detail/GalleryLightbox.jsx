import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Fullscreen viewer, portal-rendered so it escapes any ancestor's
// overflow/stacking context (same technique as PopoverPortal/VenueFilters).
const GalleryLightbox = ({
  images,
  index,
  onClose,
  onNext,
  onPrev,
  onSelect,
  touchHandlers = {},
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onNext();
      else if (event.key === "ArrowLeft") onPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Venue photo gallery"
      className="fixed inset-0 z-9999 flex flex-col bg-black/95"
      {...touchHandlers}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm font-medium tabular-nums">
          {index + 1} / {images.length}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="
            flex h-10 w-10 items-center justify-center rounded-full
            transition-colors duration-200 hover:bg-white/10
          "
        >
          <X size={22} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 select-none">
        <img
          src={images[index]}
          alt=""
          draggable={false}
          className="max-h-full max-w-full object-contain"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                flex h-11 w-11 items-center justify-center rounded-full
                bg-white/10 text-white
                transition-colors duration-200 hover:bg-white/20
              "
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                flex h-11 w-11 items-center justify-center rounded-full
                bg-white/10 text-white
                transition-colors duration-200 hover:bg-white/20
              "
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-center gap-1.5 pb-6">
          {images.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => onSelect(dotIndex)}
              aria-label={`Go to image ${dotIndex + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-200 ease-out
                ${
                  dotIndex === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

export default GalleryLightbox;
