import { useState } from "react";

// Shared "save this step, flash Saved, then advance" behavior for wizard
// steps that persist their data in one shot on Continue (Basic Info,
// Amenities, Policies) rather than incrementally per-action (Images,
// Time Slots already save on every add/remove, so Continue there is pure
// navigation). The pause before advancing exists so the "Saved" flash is
// actually visible instead of being instantly replaced by the next step.
const SAVED_PAUSE_MS = 600;

const useStepSave = (onContinue) => {
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const save = async (saveFn) => {
    try {
      setSaving(true);

      const result = await saveFn();

      setSaving(false);
      setJustSaved(true);

      setTimeout(() => onContinue(result), SAVED_PAUSE_MS);

      return result;
    } catch (error) {
      setSaving(false);
      throw error;
    }
  };

  return { saving, justSaved, save };
};

export default useStepSave;
