import { createPortal } from "react-dom";

// Renders popover content directly under document.body, positioned with
// `position: fixed` from a rect computed by usePopoverPosition. This keeps
// dropdowns/calendars/panels from being clipped by an ancestor's
// overflow-hidden (e.g. the Hero section's background-gradient wrapper).
const PopoverPortal = ({
  position,
  matchWidth = false,
  className = "",
  panelRef,
  children,
}) => {
  if (!position) return null;

  return createPortal(
    <div
      ref={panelRef}
      // Callers animate their inner content with opacity/scale, which
      // never shrinks this wrapper's own layout box - without this
      // baseline, the wrapper stays a full-size, invisible, clickable
      // dead zone over whatever sits beneath it even while "closed".
      // pointer-events-auto on the caller's inner content (when open)
      // still overrides this for its own subtree, so real popovers
      // aren't affected.
      className={`pointer-events-none ${className}`}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        ...(matchWidth ? { width: position.width } : {}),
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default PopoverPortal;
