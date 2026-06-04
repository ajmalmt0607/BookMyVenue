const Button = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`
        px-5
        py-2.5
        rounded-lg
        font-medium
        transition-all
        duration-300
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;