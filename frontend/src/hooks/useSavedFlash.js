import { useCallback, useEffect, useRef, useState } from "react";

const FLASH_DURATION_MS = 2000;

// Local "show a brief Saved confirmation" state for steps that persist
// each action immediately (Images, Time Slots) rather than saving once
// on Continue (see useStepSave for that pattern instead).
const useSavedFlash = () => {
  const [justSaved, setJustSaved] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const flash = useCallback(() => {
    setJustSaved(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setJustSaved(false),
      FLASH_DURATION_MS
    );
  }, []);

  return { justSaved, flash };
};

export default useSavedFlash;
