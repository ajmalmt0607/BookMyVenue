import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WizardStepIndicator from "../../components/owner/wizard/WizardStepIndicator";
import WizardSkeleton from "../../components/owner/wizard/WizardSkeleton";
import SubmitSuccessScreen from "../../components/owner/wizard/SubmitSuccessScreen";
import LeaveConfirmationModal from "../../components/owner/wizard/LeaveConfirmationModal";
import BasicInfoStep from "../../components/owner/wizard/steps/BasicInfoStep";
import ImagesStep from "../../components/owner/wizard/steps/ImagesStep";
import AmenitiesStep from "../../components/owner/wizard/steps/AmenitiesStep";
import PoliciesStep from "../../components/owner/wizard/steps/PoliciesStep";
import TimeSlotsStep from "../../components/owner/wizard/steps/TimeSlotsStep";
import ReviewStep from "../../components/owner/wizard/steps/ReviewStep";

import useLeaveConfirmation from "../../hooks/useLeaveConfirmation";
import {
  deleteVenueDraft,
  getVenueDraft,
  getVenueDraftProgress,
} from "../../services/venueDraftService";
import {
  REVIEW_STEP,
  STEP_KEYS,
  wizardStepPath,
} from "../../constants/wizardSteps";
import { ROUTES } from "../../constants/routes";

const STEP_COMPONENTS = {
  basic_information: BasicInfoStep,
  images: ImagesStep,
  amenities: AmenitiesStep,
  policies: PoliciesStep,
  time_slots: TimeSlotsStep,
};

const stepIndexOf = (stepKey) =>
  stepKey === REVIEW_STEP ? STEP_KEYS.length : STEP_KEYS.indexOf(stepKey);

const VenueWizardPage = () => {
  const { venueId, step } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  // Moving between the wizard's own steps changes the URL (each step is
  // its own route) but must never count as "leaving" - only navigation
  // to something outside this venue's wizard should. Everything else
  // (browser back, a sidebar link, hard refresh/tab close) still blocks.
  const shouldBlockRef = useRef(true);
  const wizardBasePath = `/owner/venues/${venueId}/create/`;

  const isInternalWizardNavigation = useCallback(
    (pathname) => pathname.startsWith(wizardBasePath),
    [wizardBasePath]
  );

  useEffect(() => {
    shouldBlockRef.current = !submitted;
  }, [submitted]);

  const blocker = useLeaveConfirmation(
    shouldBlockRef,
    undefined,
    isInternalWizardNavigation
  );

  const goToStep = useCallback(
    (stepKey) =>
      navigate(wizardStepPath(venueId, stepKey), { replace: true }),
    [navigate, venueId]
  );

  const applyProgress = (progress) => {
    setCompletedSteps(progress.completed_steps);
    setCompletionPercentage(progress.completion_percentage);

    return progress;
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const [venueData, progress] = await Promise.all([
          getVenueDraft(venueId),
          getVenueDraftProgress(venueId),
        ]);

        if (!isMounted) return;

        setVenue(venueData);
        applyProgress(progress);

        // Guard against skipping ahead of an incomplete step (stale
        // bookmark, direct URL edit, browser back after a resume) -
        // the backend's next_step is always the source of truth for how
        // far this draft has actually gotten.
        const requestedIndex = stepIndexOf(step);
        const allowedIndex = stepIndexOf(progress.next_step);

        if (requestedIndex === -1 || requestedIndex > allowedIndex) {
          navigate(wizardStepPath(venueId, progress.next_step), {
            replace: true,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
    // Deliberately only re-runs on venueId - moving between steps is
    // local navigation (goToStep), not a reason to refetch the venue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  // On the first step there's nowhere internal to go back to, so "Back"
  // means leaving the wizard - which correctly still shows the leave
  // confirmation, since that case isn't internal wizard navigation.
  const handleBack = () => {
    const previousStep = STEP_KEYS[stepIndexOf(step) - 1];

    if (previousStep) {
      goToStep(previousStep);
    } else {
      navigate(ROUTES.OWNER_VENUES);
    }
  };

  const handleContinue = async (patch) => {
    setVenue((prev) => ({ ...prev, ...patch }));

    const progress = await getVenueDraftProgress(venueId);
    applyProgress(progress);

    goToStep(progress.next_step);
  };

  const handleSubmitted = (updatedVenue) => {
    setVenue(updatedVenue);
    setSubmitted(true);
  };

  // Bypasses the blocker for a deliberate, already-confirmed exit -
  // everything before this point is already auto-saved, so there's
  // nothing left to do but navigate.
  const leaveToVenueManagement = () => {
    shouldBlockRef.current = false;
    blocker.reset?.();
    navigate(ROUTES.OWNER_VENUES, { replace: true });
  };

  const handleDiscard = async () => {
    try {
      setDiscarding(true);
      await deleteVenueDraft(venueId);
      leaveToVenueManagement();
    } catch (error) {
      console.error(error);
      setDiscarding(false);
    }
  };

  if (submitted) {
    return <SubmitSuccessScreen />;
  }

  if (loading || !venue) {
    return <WizardSkeleton />;
  }

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <div>
      <WizardStepIndicator
        currentStepKey={step === REVIEW_STEP ? null : step}
        completedSteps={completedSteps}
        completionPercentage={completionPercentage}
        onStepClick={goToStep}
      />

      <div className="pt-6">
        {step === REVIEW_STEP ? (
          <ReviewStep
            venue={venue}
            venueId={venueId}
            onBack={handleBack}
            onSubmitted={handleSubmitted}
          />
        ) : (
          StepComponent && (
            <StepComponent
              venue={venue}
              venueId={venueId}
              onBack={handleBack}
              onContinue={handleContinue}
            />
          )
        )}
      </div>

      <LeaveConfirmationModal
        isOpen={blocker.state === "blocked"}
        discarding={discarding}
        onContinueEditing={() => blocker.reset?.()}
        onSaveAndLeave={leaveToVenueManagement}
        onDiscard={handleDiscard}
      />
    </div>
  );
};

export default VenueWizardPage;
