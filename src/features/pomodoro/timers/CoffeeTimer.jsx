import { motion, AnimatePresence } from "framer-motion";

export default function CoffeeTimer({
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
  const displayRatio = phase === "focus" ? remainingRatio : 1 - remainingRatio;
  const fillPercent = displayRatio * 100;

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const showSteam = (isRunning || isPaused) && fillPercent > 10;

  const liquidColor = phase === "focus" ? "#8B4513" : "#2D5A27";
  const liquidColorLight = phase === "focus" ? "#D2691E" : "#4A7C4B";
  const foamColor = phase === "focus" ? "#F5DEB3" : "#90EE90";

  const liquidY = 70 + (100 - fillPercent) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Steam Animation */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
          <AnimatePresence>
            {showSteam && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-3 rounded-full ${
                      phase === "focus"
                        ? "bg-amber-200/60"
                        : "bg-emerald-200/60"
                    }`}
                    style={{ left: `${(i - 1) * 20}px` }}
                    initial={{ opacity: 0, y: 0, height: 8, scaleX: 1 }}
                    animate={
                      isRunning
                        ? {
                            opacity: [0, 0.6, 0.4, 0],
                            y: [-10, -50, -80],
                            height: [8, 20, 12],
                            scaleX: [1, 1.5, 0.5],
                            x: [0, (i - 1) * 8, (i - 1) * 15],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Coffee Cup SVG */}
        <svg
          width="280"
          height="320"
          viewBox="0 0 280 320"
          className="relative z-10 drop-shadow-2xl"
        >
          <defs>
            {/* Liquid Gradient */}
            <linearGradient
              id="liquidGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={liquidColorLight} />
              <stop offset="40%" stopColor={liquidColor} />
              <stop
                offset="100%"
                stopColor={phase === "focus" ? "#5D3A1A" : "#1A3D1A"}
              />
            </linearGradient>

            {/* Foam/Crema Gradient */}
            <linearGradient id="foamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={foamColor} stopOpacity="0.9" />
              <stop
                offset="100%"
                stopColor={liquidColorLight}
                stopOpacity="0.7"
              />
            </linearGradient>

            {/* Cup Body Gradient */}
            <linearGradient
              id="cupGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FAFAFA" />
              <stop offset="50%" stopColor="#F5F5F5" />
              <stop offset="100%" stopColor="#E8E8E8" />
            </linearGradient>

            {/* Cup Shadow */}
            <linearGradient id="cupShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4D4D4" />
              <stop offset="50%" stopColor="#FAFAFA" />
              <stop offset="100%" stopColor="#D4D4D4" />
            </linearGradient>

            {/* Inner Cup Shadow */}
            <radialGradient id="innerCupShadow" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Clip path for liquid */}
            <clipPath id="cupInterior">
              <path
                d="M 60,70 
                   L 70,250 
                   Q 75,270 140,270
                   Q 205,270 210,250
                   L 220,70 
                   Z"
              />
            </clipPath>
          </defs>

          {/* Saucer */}
          <ellipse cx="140" cy="295" rx="100" ry="18" fill="#E8E8E8" />
          <ellipse cx="140" cy="292" rx="90" ry="14" fill="#F5F5F5" />
          <ellipse cx="140" cy="290" rx="70" ry="10" fill="#FAFAFA" />

          {/* Cup Body */}
          <path
            d="M 50,60 
               L 65,260 
               Q 70,285 140,285
               Q 210,285 215,260
               L 230,60 
               Q 230,50 220,50
               L 60,50
               Q 50,50 50,60
               Z"
            fill="url(#cupGradient)"
            stroke="#E0E0E0"
            strokeWidth="2"
          />

          {/* Cup Handle */}
          <path
            d="M 225,90 
               Q 270,100 270,160
               Q 270,220 225,230"
            fill="none"
            stroke="url(#cupGradient)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 225,90 
               Q 255,100 255,160
               Q 255,220 225,230"
            fill="none"
            stroke="#F5F5F5"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Cup Rim */}
          <ellipse
            cx="140"
            cy="52"
            rx="92"
            ry="12"
            fill="#FAFAFA"
            stroke="#E8E8E8"
            strokeWidth="1"
          />
          <ellipse cx="140" cy="50" rx="88" ry="10" fill="#FFFFFF" />

          {/* Inner cup shadow */}
          <ellipse
            cx="140"
            cy="65"
            rx="78"
            ry="8"
            fill="url(#innerCupShadow)"
          />

          {/* Liquid Container */}
          <g clipPath="url(#cupInterior)">
            {/* Liquid */}
            <rect
              x="50"
              y={liquidY}
              width="180"
              height="220"
              fill="url(#liquidGradient)"
              style={{ transition: "y 0.5s ease-out" }}
            />

            {/* Liquid Surface Wave */}
            <motion.path
              fill={liquidColorLight}
              opacity="0.4"
              animate={
                isRunning
                  ? {
                      d: [
                        `M 50,${liquidY} Q 95,${
                          liquidY - 5
                        } 140,${liquidY} T 230,${liquidY} L 230,${
                          liquidY + 5
                        } L 50,${liquidY + 5} Z`,
                        `M 50,${liquidY} Q 95,${
                          liquidY + 5
                        } 140,${liquidY} T 230,${liquidY} L 230,${
                          liquidY + 5
                        } L 50,${liquidY + 5} Z`,
                        `M 50,${liquidY} Q 95,${
                          liquidY - 5
                        } 140,${liquidY} T 230,${liquidY} L 230,${
                          liquidY + 5
                        } L 50,${liquidY + 5} Z`,
                      ],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Foam/Crema Layer */}
            {fillPercent > 5 && (
              <ellipse
                cx="140"
                cy={liquidY - 2}
                rx="75"
                ry="8"
                fill="url(#foamGradient)"
              />
            )}
          </g>

          {/* Cup Shine */}
          <path
            d="M 70,80 Q 75,150 85,200"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 80,90 Q 82,120 88,150"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Decorative Ring on Cup */}
          <ellipse
            cx="140"
            cy="240"
            rx="72"
            ry="6"
            fill="none"
            stroke={phase === "focus" ? "#F59E0B" : "#10B981"}
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>

        {/* Time Display */}
        <div className="mt-8 text-center">
          <div
            className={`text-7xl font-black tracking-tight tabular-nums bg-gradient-to-br ${
              phase === "focus"
                ? "from-amber-600 via-orange-500 to-amber-700"
                : "from-emerald-600 via-teal-500 to-emerald-700"
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
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "bg-gradient-to-r from-emerald-400 to-teal-500"
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
