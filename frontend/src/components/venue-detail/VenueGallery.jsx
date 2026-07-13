import { memo, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2 } from "lucide-react";

import useCarousel from "../../hooks/useCarousel";
import Shimmer from "../ui/Shimmer";
import GalleryLightbox from "./GalleryLightbox";

const HERO_HEIGHT = "h-[420px] md:h-[480px] lg:h-[520px]";

const VenueGallery = ({ images = [] }) => {
  const urls = useMemo(
    () => images.map((image) => image.image).filter(Boolean),
    [images]
  );

  const { index, setIndex, next, prev, touchHandlers } = useCarousel(
    urls.length
  );

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});

  const hasImages = urls.length > 0;
  const hasMultiple = urls.length > 1;

  const markLoaded = (imageIndex) => {
    setLoadedMap((prev) =>
      prev[imageIndex] ? prev : { ...prev, [imageIndex]: true }
    );
  };

  const handleGalleryKeyDown = (event) => {
    if (event.key === "ArrowRight") next();
    else if (event.key === "ArrowLeft") prev();
  };

  if (!hasImages) {
    return (
      <div
        className={`
          ${HERO_HEIGHT} w-full flex items-center justify-center gap-2
          rounded-3xl bg-gray-100 text-gray-400
        `}
      >
        <ImageOff size={22} />
        <span>No images available</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`
          relative ${HERO_HEIGHT} w-full overflow-hidden rounded-3xl
          bg-gray-100 select-none
        `}
        tabIndex={hasMultiple ? 0 : -1}
        role="group"
        aria-roledescription="carousel"
        aria-label="Venue photos"
        onKeyDown={hasMultiple ? handleGalleryKeyDown : undefined}
        {...(hasMultiple ? touchHandlers : {})}
      >
        {!loadedMap[index] && <Shimmer className="absolute inset-0" />}

        <img
          src={urls[index]}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => markLoaded(index)}
          className={`
            h-full w-full object-cover
            transition-opacity duration-300 ease-out
            ${loadedMap[index] ? "opacity-100" : "opacity-0"}
          `}
        />

        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="View fullscreen gallery"
          className="
            absolute right-4 top-4 z-10
            flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2
            text-sm font-semibold text-gray-800 shadow-md
            transition-colors duration-200 hover:bg-white
          "
        >
          <Maximize2 size={15} />
          View all photos
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="
                absolute left-3 top-1/2 z-10 -translate-y-1/2
                flex h-10 w-10 items-center justify-center rounded-full
                bg-white/90 text-gray-800 shadow-md
                transition-colors duration-200 hover:bg-white
              "
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="
                absolute right-3 top-1/2 z-10 -translate-y-1/2
                flex h-10 w-10 items-center justify-center rounded-full
                bg-white/90 text-gray-800 shadow-md
                transition-colors duration-200 hover:bg-white
              "
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {urls.map((url, dotIndex) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Go to image ${dotIndex + 1}`}
                  className={`
                    h-1.5 rounded-full transition-all duration-200 ease-out
                    ${
                      dotIndex === index
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/60 hover:bg-white/80"
                    }
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 hidden lg:flex gap-3 overflow-x-auto pb-1">
          {urls.map((url, thumbIndex) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(thumbIndex)}
              aria-label={`Show image ${thumbIndex + 1}`}
              aria-current={thumbIndex === index}
              className={`
                h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2
                transition-colors duration-200 ease-out
                ${
                  thumbIndex === index
                    ? "border-red-600"
                    : "border-transparent hover:border-gray-200"
                }
              `}
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <GalleryLightbox
          images={urls}
          index={index}
          onClose={() => setIsLightboxOpen(false)}
          onNext={next}
          onPrev={prev}
          onSelect={setIndex}
          touchHandlers={hasMultiple ? touchHandlers : {}}
        />
      )}
    </div>
  );
};

export default memo(VenueGallery);
