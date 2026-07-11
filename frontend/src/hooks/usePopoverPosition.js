import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// Tracks a trigger element's viewport rect so portal-rendered popovers
// (calendar, autocomplete, guest selector) can position themselves with
// `position: fixed`, independent of any clipping/overflow ancestors.
const usePopoverPosition = (triggerRef, isOpen, { gap = 8 } = {}) => {
  const [position, setPosition] = useState(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + gap,
      left: rect.left,
      width: rect.width,
    });
  }, [triggerRef, gap]);

  // Measure once on mount so the popover has a valid position the first
  // time it opens, matching the always-mounted-but-hidden panel pattern.
  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  return position;
};

export default usePopoverPosition;
