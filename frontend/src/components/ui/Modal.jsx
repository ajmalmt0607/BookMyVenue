const Modal = ({
  isOpen,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        flex
        items-center
        justify-center
        p-4
      "
    >
      {children}
    </div>
  );
};

export default Modal;