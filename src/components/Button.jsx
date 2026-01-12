import { forwardRef } from "react";
import SpinnerMini from "./SpinnerMini";

const variants = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 shadow-sm active:scale-95 transition-all text-zinc-50",
  secondary:
    "bg-white/40 text-zinc-700 hover:bg-zinc-50 disabled:bg-zinc-100 border border-zinc-200 backdrop-blur-sm",
  danger:
    "bg-red-50/50 text-red-600 hover:bg-red-50 disabled:opacity-50 border border-red-100",
  ghost: "text-zinc-600 hover:bg-zinc-50 disabled:opacity-50",
  "ghost-danger": "text-red-600 hover:bg-red-50 disabled:opacity-50",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-zinc-300 shadow-sm",
  outline:
    "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50",
  "outline-danger":
    "border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50",
  "outline-secondary":
    "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 transition-all duration-300 hover:border-zinc-400 hover:bg-white",
  "outline-success":
    "border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50",
  gradient:
    "group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3.5 text-base gap-2.5",
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
          <SpinnerMini size={size} />
          {children}
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
