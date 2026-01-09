import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    id,
    type = "text",
    placeholder,
    icon: Icon,
    error,
    hint,
    className = "",
    disabled = false,
    ...props
  },
  ref
) {
  const baseInputStyles = "w-full pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors";
  const iconPadding = Icon ? "pl-10" : "pl-4";
  const errorStyles = error ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500";
  const disabledStyles = disabled ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "";

  return (
    <div className={className}>
      {label && <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}

      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input ref={ref} id={id} type={type} placeholder={placeholder} disabled={disabled} className={`${baseInputStyles} ${iconPadding} ${errorStyles} ${disabledStyles}`} {...props} />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
});

export default Input;