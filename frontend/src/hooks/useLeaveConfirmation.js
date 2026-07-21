import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router-dom";
const useLeaveConfirmation = (shouldBlockRef, onConfirmedLeave) => {
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
