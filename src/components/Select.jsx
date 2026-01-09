import { forwardRef } from "react";
import { COLOR_SCHEMES } from "../styles/colorSchemes";

const Select = forwardRef(function Select(
  {
    value,
    onChange,
    options = [],
    placeholder = "",
    className = "",
    focusColor = "blue",
    disabled = false,
    ...props
  },
  ref
) {
  const baseStyles =
    "px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none bg-white";
  const focusStyles =
    COLOR_SCHEMES[focusColor]?.focusBorder || COLOR_SCHEMES.blue.focusBorder;
  const disabledStyles = disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "";

  return (
    <select ref={ref} value={value} onChange={onChange} disabled={disabled} className={`${baseStyles} ${focusStyles} ${disabledStyles} ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => {
        if (typeof option === "string") {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        }
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
});

export default Select;
