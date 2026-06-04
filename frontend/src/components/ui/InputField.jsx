const InputField = ({
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="relative">

      <div
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      >
        {icon}
      </div>

      <input
        {...props}
        className={`
          w-full
          h-12
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          pl-12
          pr-4
          outline-none
          transition-all
          focus:border-red-500
          focus:bg-white
          ${className}
        `}
      />

    </div>
  );
};

export default InputField;