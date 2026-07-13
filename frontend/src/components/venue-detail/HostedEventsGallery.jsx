import { memo, useMemo } from "react";

// Placeholder until a dedicated "hosted events" media backend exists —
// reuses the venue's own photos as stand-in imagery for the strip.
const HostedEventsGallery = ({ images = [] }) => {
  const urls = useMemo(
    () => images.map((image) => image.image).filter(Boolean),
    [images]
  );

  if (!urls.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">
        Events Hosted Here
      </h2>

      <p className="mt-1 text-gray-500">
        A glimpse of past celebrations at this venue.
      </p>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {urls.map((url) => (
          <img
            key={url}
            src={url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-48 w-64 shrink-0 rounded-2xl object-cover"
          />
        ))}
      </div>
    </section>
  );
};

export default memo(HostedEventsGallery);
