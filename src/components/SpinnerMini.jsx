import { LoaderCircle } from "lucide-react";

export default function SpinnerMini({ className = "" }) {
  return (
    <LoaderCircle
      className={`h-[2.4rem] w-[2.4rem] animate-spin ${className}`}
      style={{ animationDuration: "1.5s", animationTimingFunction: "linear" }}
      aria-label="Loading"
      role="status"
    />
  );
}
