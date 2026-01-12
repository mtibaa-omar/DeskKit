import { LoaderCircle } from "lucide-react";

const spinnerSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function SpinnerMini({ size = "md" }) {
  const sizeClass = spinnerSizes[size] || spinnerSizes.md;

  return (
    <LoaderCircle
      className={`${sizeClass} animate-spin`}
      style={{ animationDuration: "1.5s", animationTimingFunction: "linear" }}
      aria-label="Loading"
      role="status"
    />
  );
}
