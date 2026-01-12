import { motion } from "framer-motion";

export default function PlantTimer({
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
  const growthPercent = (1 - remainingRatio) * 100;

  const isRunning = status === "running";

  // Plant growth - stem grows from soil (y=295) upward
  const maxStemHeight = 140;
  const stemHeight = (growthPercent / 100) * maxStemHeight;
  const stemBase = 295;
  const stemTop = stemBase - stemHeight;

  const primaryColor = phase === "focus" ? "#22c55e" : "#14b8a6";
  const secondaryColor = phase === "focus" ? "#16a34a" : "#0d9488";
  const flowerColor = phase === "focus" ? "#f472b6" : "#c084fc";
  const flowerColorInner = phase === "focus" ? "#fbbf24" : "#facc15";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Main Plant SVG */}
        <svg
          width="280"
          height="380"
          viewBox="0 0 280 380"
          className="relative z-10"
        >
          <defs>
            <linearGradient
              id="potGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <linearGradient id="stemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={secondaryColor} />
              <stop offset="50%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>

            <linearGradient
              id="leafGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>

          {/* Pot Body */}
          <path
            d="M 90,320 L 100,370 Q 105,380 140,380 Q 175,380 180,370 L 190,320 Z"
            fill="url(#potGradient)"
          />
          <ellipse cx="140" cy="320" rx="52" ry="10" fill="#D97706" />

          {/* Pot Rim */}
          <path
            d="M 85,310 L 85,325 Q 85,330 95,330 L 185,330 Q 195,330 195,325 L 195,310 Q 195,305 185,305 L 95,305 Q 85,305 85,310 Z"
            fill="#EA580C"
          />
          <ellipse cx="140" cy="307" rx="55" ry="8" fill="#FB923C" />

          {/* Soil */}
          <ellipse cx="140" cy="300" rx="48" ry="8" fill="url(#soilGradient)" />

          {/* Stem - grows upward from soil */}
          {stemHeight > 5 && (
            <rect
              x="136"
              y={stemTop}
              width="8"
              height={stemHeight}
              rx="4"
              fill="url(#stemGradient)"
            />
          )}

          {/* First pair of leaves - at 20% */}
          {growthPercent > 20 && stemHeight > 20 && (
            <g style={{ opacity: Math.min((growthPercent - 20) / 15, 1) }}>
              <ellipse
                cx="140"
                cy={stemBase - stemHeight * 0.3}
                rx="25"
                ry="10"
                fill="url(#leafGradient)"
                transform={`rotate(-45 140 ${
                  stemBase - stemHeight * 0.3
                }) translate(-15 0)`}
              />
              <ellipse
                cx="140"
                cy={stemBase - stemHeight * 0.3}
                rx="25"
                ry="10"
                fill="url(#leafGradient)"
                transform={`rotate(45 140 ${
                  stemBase - stemHeight * 0.3
                }) translate(15 0)`}
              />
            </g>
          )}

          {/* Second pair of leaves - at 40% */}
          {growthPercent > 40 && stemHeight > 50 && (
            <motion.g
              style={{ opacity: Math.min((growthPercent - 40) / 15, 1) }}
              animate={isRunning ? { rotate: [-2, 2, -2] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ellipse
                cx="140"
                cy={stemBase - stemHeight * 0.6}
                rx="28"
                ry="11"
                fill="url(#leafGradient)"
                transform={`rotate(-50 140 ${
                  stemBase - stemHeight * 0.6
                }) translate(-18 0)`}
              />
              <ellipse
                cx="140"
                cy={stemBase - stemHeight * 0.6}
                rx="28"
                ry="11"
                fill="url(#leafGradient)"
                transform={`rotate(50 140 ${
                  stemBase - stemHeight * 0.6
                }) translate(18 0)`}
              />
            </motion.g>
          )}

          {/* Top leaves - at 65% */}
          {growthPercent > 65 && stemHeight > 80 && (
            <motion.g
              style={{ opacity: Math.min((growthPercent - 65) / 15, 1) }}
              animate={isRunning ? { rotate: [2, -2, 2] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <ellipse
                cx="140"
                cy={stemTop + 15}
                rx="22"
                ry="9"
                fill="url(#leafGradient)"
                transform={`rotate(-55 140 ${stemTop + 15}) translate(-12 0)`}
              />
              <ellipse
                cx="140"
                cy={stemTop + 15}
                rx="22"
                ry="9"
                fill="url(#leafGradient)"
                transform={`rotate(55 140 ${stemTop + 15}) translate(12 0)`}
              />
            </motion.g>
          )}

          {/* Flower - at 85% */}
          {growthPercent > 85 && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: Math.min((growthPercent - 85) / 15, 1) }}
              style={{ transformOrigin: `140px ${stemTop}px` }}
            >
              {[...Array(6)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="140"
                  cy={stemTop - 15}
                  rx="10"
                  ry="18"
                  fill={flowerColor}
                  opacity="0.9"
                  transform={`rotate(${i * 60} 140 ${stemTop - 5})`}
                />
              ))}
              <circle cx="140" cy={stemTop - 5} r="8" fill={flowerColorInner} />
            </motion.g>
          )}
        </svg>

        {/* Time Display */}
        <div className="mt-6 text-center">
          <div
            className={`text-7xl font-black tracking-tight tabular-nums bg-gradient-to-br ${
              phase === "focus"
                ? "from-green-600 via-emerald-500 to-green-700"
                : "from-teal-600 via-cyan-500 to-teal-700"
            } bg-clip-text text-transparent`}
          >
            {String(minutes).padStart(2, "0")}
            <span className="mx-1 opacity-60">:</span>
            {String(seconds).padStart(2, "0")}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-48 mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                phase === "focus"
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : "bg-gradient-to-r from-teal-400 to-cyan-500"
              }`}
              animate={{ width: `${remainingRatio * 100}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
