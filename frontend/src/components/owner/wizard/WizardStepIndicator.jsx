import { Check } from "lucide-react";

import { WIZARD_STEPS } from "../../../constants/wizardSteps";
import { OWNER_STICKY_TOP } from "../../../constants/layout";

const WizardStepIndicator = ({
  currentStepKey,
  completedSteps,
  completionPercentage,
  onStepClick,
}) => {
  const currentIndex = WIZARD_STEPS.findIndex(
    (step) => step.key === currentStepKey
  );

  // currentStepKey is null on the Review screen - every step is complete
  // by definition there, so "Step X of Y" gives way to a plain label.
  const stepLabel =
    currentStepKey === null
      ? "Review"
      : `Step ${Math.max(currentIndex, 0) + 1} of ${WIZARD_STEPS.length}`;

  return (
    // Sticky (pure CSS, no scroll listener) at the exact same offset as
    // OwnerSidebar (OWNER_STICKY_TOP, shared from constants/layout) so
    // the two stay level while scrolling instead of drifting apart -
    // two independently-tuned offsets is what caused the misalignment
    // this is fixing. Styled like every other card in the owner area
    // (same rounded-3xl + border-gray-100 as OwnerSidebar/OwnerVenueCard)
    // so it reads as a card, not a bespoke bar. position: sticky (not
    // fixed) means it reserves its own space in normal flow, so the
    // form below can never render behind it.
    <div
      className={`sticky ${OWNER_STICKY_TOP} z-20 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-500">{stepLabel}</p>

        <p className="text-sm font-bold text-red-600">
          {completionPercentage}% Complete
        </p>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-red-600 transition-[width] duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <div className="flex items-start">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.key);
          const isCurrent = step.key === currentStepKey;
          const isClickable = isCompleted || isCurrent;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="flex flex-1 items-center last:flex-none"
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.key)}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full border-2 transition-all duration-200
                    ${
                      isCompleted
                        ? "border-red-600 bg-red-600 text-white"
                        : isCurrent
                          ? "border-red-600 bg-white text-red-600"
                          : "border-gray-200 bg-white text-gray-400"
                    }
                    ${
                      isClickable
                        ? "cursor-pointer group-hover:border-red-400"
                        : "cursor-default"
                    }
                  `}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={16} />}
                </span>

                <span
                  className={`
                    hidden text-center text-xs font-semibold sm:block
                    ${
                      isCurrent
                        ? "text-red-600"
                        : isCompleted
                          ? "text-gray-700"
                          : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </span>
              </button>

              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`
                    mx-2 mb-6 h-0.5 flex-1 rounded-full
                    ${isCompleted ? "bg-red-600" : "bg-gray-200"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardStepIndicator;
