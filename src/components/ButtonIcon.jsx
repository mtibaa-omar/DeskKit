import { forwardRef } from "react";
import SpinnerMini from "./SpinnerMini";

const variants = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 shadow-sm active:scale-95",
  secondary: "bg-white text-zinc-700 hover:bg-zinc-50 disabled:bg-zinc-100 border border-zinc-200 shadow-sm",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 border border-red-100",
  ghost: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50",
  "ghost-danger": "text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50",
};

const sizes = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const ButtonIcon = forwardRef(function ButtonIcon(
  {
    icon: Icon,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    className = "",
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
        flex items-center justify-center rounded-lg transition-all duration-200
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <SpinnerMini size={size} />
      ) : (
        <Icon className={`${iconSizes[size]}`} />
      )}
    </button>
  );
});

export default ButtonIcon;
