export default function Spinner({ className = "" }) {
  return (
    <div
      className={`mx-auto my-[4.8rem] h-[6.4rem] w-[6.4rem] rounded-full animate-spin ${className}`}
      style={{
        background: `
          radial-gradient(farthest-side, oklch(54.6% 0.245 262.881) 94%, transparent)
            top/10px 10px no-repeat,
          conic-gradient(transparent 30%, oklch(54.6% 0.245 262.881))
        `,
        WebkitMask:
          "radial-gradient(farthest-side, transparent calc(100% - 10px), oklch(54.6% 0.245 262.881) 0)",
        mask:
          "radial-gradient(farthest-side, transparent calc(100% - 10px), oklch(54.6% 0.245 262.881) 0)",
        animationDuration: "1.5s",
        animationTimingFunction: "linear",
      }}
      aria-label="Loading"
      role="status"
    />
  );
}
