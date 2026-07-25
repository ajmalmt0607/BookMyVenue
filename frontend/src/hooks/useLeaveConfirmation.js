import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router-dom";

// `isInternalNavigation`, if given, exempts transitions to pathnames it
// accepts from blocking - e.g. a multi-route wizard moving between its
// own steps changes the pathname too, but that isn't "leaving" the way
// navigating elsewhere in the app is. Optional and backward compatible:
// existing callers that don't pass it keep blocking on every pathname
// change, exactly as before.
const useLeaveConfirmation = (
  shouldBlockRef,
  onConfirmedLeave,
  isInternalNavigation
) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlockRef.current &&
      currentLocation.pathname !== nextLocation.pathname &&
      !isInternalNavigation?.(nextLocation.pathname)
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!shouldBlockRef.current) return;

      event.preventDefault();
      event.returnValue = "";
    };

    const handlePageHide = () => {
      if (!shouldBlockRef.current) return;

      onConfirmedLeave?.();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [shouldBlockRef, onConfirmedLeave]);

  const proceed = useCallback(() => {
    onConfirmedLeave?.();
    blocker.proceed?.();
  }, [blocker, onConfirmedLeave]);

  return { ...blocker, proceed };
};

export default useLeaveConfirmation;
