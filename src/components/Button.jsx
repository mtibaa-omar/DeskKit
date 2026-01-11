import { forwardRef } from "react";
import SpinnerMini from "./SpinnerMini";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 shadow-sm",
  secondary: "bg-white/40 text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 border-2 border-gray-300",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50",
  ghost: "text-gray-600 hover:bg-gray-100 disabled:opacity-50",
  "ghost-danger": "text-red-600 hover:bg-red-50 disabled:opacity-50",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 shadow-sm",
  outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50",
  "outline-danger": "border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50",
  "outline-secondary": "border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 duration-300 hover:scale-105 border-2 border-gray-300 hover:border-blue-500 hover:bg-white transition-all duration-300 ",
  "outline-success": "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50",
  gradient: "group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-4 py-3 gap-2",
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "lg",
    icon: Icon,
    iconPosition = "left",
    isLoading = false,
    disabled,
    className = "",
    fullWidth = false,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        flex items-center justify-center font-semibold rounded-lg transition-colors
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerMini size="md" color="current" />
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
          )}
        </>
      )}
    </button>
  );
});

export default Button;
