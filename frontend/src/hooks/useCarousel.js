import { useCallback, useRef, useState } from "react";

const SWIPE_THRESHOLD = 40;

// Shared slide-index + touch-swipe state for any horizontal carousel
// (venue gallery, fullscreen lightbox). Keeps handlers referentially
// stable via functional state updates so consumers can safely memo
// around them.
const useCarousel = (length) => {
  const [index, setIndex] = useState(0);

  const touchStart = useRef({ x: 0, y: 0 });
  const isHorizontalSwipe = useRef(false);

  const goToRelative = useCallback(
    (step) => {
      if (length < 2) return;
      setIndex((prev) => (prev + step + length) % length);
    },
    [length]
  );

  const goToIndex = useCallback(
    (nextIndex) => {
      if (length === 0) return;
      setIndex(Math.min(Math.max(nextIndex, 0), length - 1));
    },
    [length]
  );

  const next = useCallback(() => goToRelative(1), [goToRelative]);
  const prev = useCallback(() => goToRelative(-1), [goToRelative]);

  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    isHorizontalSwipe.current = false;
  }, []);

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
        goToRelative(deltaX < 0 ? 1 : -1);
      }

      isHorizontalSwipe.current = false;
    },
    [goToRelative]
  );

  return {
    index,
    setIndex: goToIndex,
    next,
    prev,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

export default useCarousel;
