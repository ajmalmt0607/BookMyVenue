import { useEffect } from "react";

// Accepts either a single ref or an array of refs — an element is
// considered "inside" if any of the given refs contain it. This lets
// callers with portal-rendered content (e.g. a trigger ref plus a
// separately-mounted panel ref) treat both as one logical region.
const useClickOutside = (
  refs,
  callback
) => {
  useEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs];

    const handleClick = (
      event
    ) => {
      const isInside = refList.some(
        (ref) =>
          ref.current &&
          ref.current.contains(event.target)
      );

      if (!isInside) {
        callback();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, [refs, callback]);
};

export default useClickOutside;