import { motion } from "framer-motion";

export default function SimpleTimer({
  timeLeft,
  phase,
  status,
  focusMinutes,
  breakMinutes,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const totalSeconds = Math.max(
    1,
    phase === "focus" ? focusMinutes * 60 : breakMinutes * 60
  );

  const remainingRatio = Math.max(0, Math.min(1, timeLeft / totalSeconds));
  const isRunning = status === "running";

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - remainingRatio);

  const colors = {
    focus: {
      ring: "#18181b",
      ringBg: "#f4f4f5",
      text: "#18181b",
      dot: "#27272a",
    },
    break: {
      ring: "#2563eb",
      ringBg: "#eff6ff",
      text: "#1e40af",
      dot: "#3b82f6",
    },
  };

  const c = colors[phase];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Circular Progress */}
        <svg width="260" height="260" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={c.ringBg}
            strokeWidth="5"
          />
          {/* Progress circle */}
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={c.ring}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
          />
        </svg>

        {/* Time Display - centered in circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-6xl font-medium tabular-nums tracking-tight"
            style={{ color: c.text }}
          >
            {String(minutes).padStart(2, "0")}
            <span style={{ color: c.ringBg }}>:</span>
            {String(seconds).padStart(2, "0")}
          </div>

          {/* Status indicator */}
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm border border-black/5">
            <span
              className={`w-1.5 h-1.5 rounded-full`}
              style={{
                backgroundColor: c.dot,
                animation: isRunning ? "pulse 2s infinite" : "none",
              }}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              {phase}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
