import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

// Guards the Payment page while a reservation is actively held: blocks
// in-app navigation (Back button, link clicks) with a real confirmation
// dialog via React Router's useBlocker (requires the data router), and
// warns on tab close/refresh via the native beforeunload prompt. The
// browser's beforeunload text is generic and can't be customized - that
// is a platform restriction, not a gap here.
//
// Takes a ref (not a plain boolean) deliberately: the auto-redirect that
// fires when the countdown hits zero calls navigate() synchronously,
// before React has re-rendered with the new "expired" state, so a
// closure over a boolean would still see the stale "should block" value
// at that exact moment and could wrongly intercept its own redirect. A
// ref's `.current` is always read fresh regardless of render timing.
const useLeaveConfirmation = (shouldBlockRef) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlockRef.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!shouldBlockRef.current) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlockRef]);

  return blocker;
};

export default useLeaveConfirmation;
