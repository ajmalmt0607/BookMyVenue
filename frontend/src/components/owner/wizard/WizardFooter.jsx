import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import SavedIndicator from "./SavedIndicator";

const WizardFooter = ({
  onBack,
  onContinue,
  backLabel = "Back",
  continueLabel = "Continue",
  continueDisabled = false,
  saving = false,
  justSaved = false,
}) => (
  // A sibling of the step content (never nested inside its space-y-*
  // wrapper) so it isn't pulled away by that rhythm - full width to
  // match the form above it, solid white (not blurred/translucent) so
  // it reads as one continuous panel with the content rather than a
  // separate floating block.
  <div className="sticky bottom-0 border-t border-gray-100 bg-white py-4">
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="
          flex items-center gap-2 rounded-xl px-5 py-3
          text-sm font-semibold text-gray-600
          transition-colors duration-200 hover:bg-gray-50
        "
      >
        <ArrowLeft size={16} />
        {backLabel}
      </button>

      <div className="flex items-center gap-4">
        <SavedIndicator show={justSaved && !saving} />

        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || saving}
          className="
            flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3
            text-sm font-semibold text-white
            transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md
            disabled:pointer-events-none disabled:opacity-50
            disabled:hover:translate-y-0
          "
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {continueLabel}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default WizardFooter;
