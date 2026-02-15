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
      ring: "#4f46e5",
      ringBg: "#e0e7ff",
      text: "#312e81",
      dot: "#6366f1",
    },
    break: {
      ring: "#10b981",
      ringBg: "#d1fae5",
      text: "#065f46",
      dot: "#34d399",
    },
  };

  const c = colors[phase];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="260" height="260" className="transform -rotate-90">
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={c.ringBg}
            strokeWidth="5"
          />
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

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-6xl font-medium tabular-nums tracking-tight"
            style={{ color: c.text }}
          >
            {String(minutes).padStart(2, "0")}
            <span style={{ color: c.ringBg }}>:</span>
            {String(seconds).padStart(2, "0")}
          </div>

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
