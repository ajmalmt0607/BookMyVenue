import { useEffect, useRef, useState } from "react";

const getRemaining = (reservedUntil) => {
  if (!reservedUntil) {
    return { totalSeconds: 0, minutes: "00", seconds: "00", isExpired: true };
  }

  const diffMs = new Date(reservedUntil).getTime() - Date.now();

  if (diffMs <= 0) {
    return { totalSeconds: 0, minutes: "00", seconds: "00", isExpired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    totalSeconds,
    minutes: String(Math.floor(totalSeconds / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
    isExpired: false,
  };
};

// The single reservation countdown in the app - only ever mounted on the
// Payment page. Drives the expiry redirect itself rather than being
// purely decorative, unlike the old per-page ReservationTimer.
const useReservationCountdown = (reservedUntil, onExpire) => {
  const [remaining, setRemaining] = useState(() =>
    getRemaining(reservedUntil)
  );

  const hasFiredExpiry = useRef(false);

  useEffect(() => {
    hasFiredExpiry.current = false;
    setRemaining(getRemaining(reservedUntil));
  }, [reservedUntil]);

  useEffect(() => {
    if (!reservedUntil) return undefined;

    const interval = setInterval(() => {
      const next = getRemaining(reservedUntil);
      setRemaining(next);

      if (next.isExpired && !hasFiredExpiry.current) {
        hasFiredExpiry.current = true;
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservedUntil, onExpire]);

  return remaining;
};

export default useReservationCountdown;
