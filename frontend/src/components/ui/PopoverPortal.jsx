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
      className={className}
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
