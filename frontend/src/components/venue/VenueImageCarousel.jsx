import { memo, useCallback, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

import Shimmer from "../ui/Shimmer";

const SWIPE_THRESHOLD = 40;

// Nested inside VenueCard's clickable <Link>, so every control here must
// stop propagation/prevent default — otherwise interacting with an arrow,
// dot, or swipe gesture would also navigate to the venue detail page.
const VenueImageCarousel = ({ images = [], alt = "" }) => {
  const [index, setIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState({});
  // Secondary images only start downloading once the user actually engages
  // with the carousel (hover/touch/arrow), so a grid full of cards doesn't
  // eagerly fetch every image up front.
  const [hasInteracted, setHasInteracted] = useState(false);

  const touchStart = useRef({ x: 0, y: 0 });
  const isHorizontalSwipe = useRef(false);

  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const displayImages = useMemo(
    () => (hasInteracted ? images : images.slice(0, 1)),
    [hasInteracted, images]
  );

  const activateCarousel = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const goToRelative = useCallback(
    (step) => {
      setIndex((prev) => (prev + step + images.length) % images.length);
    },
    [images.length]
  );

  const goToIndex = useCallback((nextIndex) => {
    setIndex(nextIndex);
  }, []);

  const handlePrev = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      activateCarousel();
      goToRelative(-1);
    },
    [activateCarousel, goToRelative]
  );

  const handleNext = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      activateCarousel();
      goToRelative(1);
    },
    [activateCarousel, goToRelative]
  );

  const handleDotClick = useCallback(
    (event, dotIndex) => {
      event.preventDefault();
      event.stopPropagation();
      activateCarousel();
      goToIndex(dotIndex);
    },
    [activateCarousel, goToIndex]
  );

  const handleTouchStart = useCallback(
    (event) => {
      activateCarousel();
      const touch = event.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      isHorizontalSwipe.current = false;
    },
    [activateCarousel]
  );

  const handleTouchMove = useCallback((event) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isHorizontalSwipe.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;

      if (isHorizontalSwipe.current && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        event.preventDefault();
        event.stopPropagation();
        goToRelative(deltaX < 0 ? 1 : -1);
      }

      isHorizontalSwipe.current = false;
    },
    [goToRelative]
  );

  const markLoaded = useCallback((imageIndex) => {
    setLoadedMap((prev) =>
      prev[imageIndex] ? prev : { ...prev, [imageIndex]: true }
    );
  }, []);

  if (!hasImages) {
    return (
      <div className="flex h-56 w-full items-center justify-center gap-2 bg-gray-100 text-gray-400">
        <ImageOff size={20} />
        <span className="text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div
      className="relative h-56 w-full overflow-hidden select-none"
      onMouseEnter={hasMultiple ? activateCarousel : undefined}
      onTouchStart={hasMultiple ? handleTouchStart : undefined}
      onTouchMove={hasMultiple ? handleTouchMove : undefined}
      onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
    >
      <div
        className="flex h-full transition-transform duration-200 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {displayImages.map((src, imageIndex) => (
          <div key={src} className="relative h-full w-full shrink-0">
            {!loadedMap[imageIndex] && (
              <Shimmer className="absolute inset-0" />
            )}

            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => markLoaded(imageIndex)}
              className={`
                h-full w-full object-cover
                transition-opacity duration-200 ease-out
                ${loadedMap[imageIndex] ? "opacity-100" : "opacity-0"}
              `}
            />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="
              absolute left-2 top-1/2 z-10 -translate-y-1/2
              flex h-8 w-8 items-center justify-center rounded-full
              bg-white/90 text-gray-800 shadow-md
              opacity-0 transition-opacity duration-200 ease-out
              group-hover:opacity-100 hover:bg-white
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="
              absolute right-2 top-1/2 z-10 -translate-y-1/2
              flex h-8 w-8 items-center justify-center rounded-full
              bg-white/90 text-gray-800 shadow-md
              opacity-0 transition-opacity duration-200 ease-out
              group-hover:opacity-100 hover:bg-white
            "
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((src, dotIndex) => (
              <button
                key={src}
                type="button"
                onClick={(event) => handleDotClick(event, dotIndex)}
                aria-label={`Go to image ${dotIndex + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-200 ease-out
                  ${
                    dotIndex === index
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60 hover:bg-white/80"
                  }
                `}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(VenueImageCarousel);
