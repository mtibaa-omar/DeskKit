import { motion, AnimatePresence } from "framer-motion";

export default function CandleTimer({
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
  const candleHeight = displayRatio * 180;

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isStopped = status === "stopped" || timeLeft === 0;
  const showFlame = (isRunning || isPaused) && fillPercent > 5;
  const showSmoke = fillPercent <= 5;

  const candleColor = phase === "focus" ? "#FEF3C7" : "#DBEAFE";
  const candleColorDark = phase === "focus" ? "#FDE68A" : "#BFDBFE";
  const flameColor = phase === "focus" ? "#F59E0B" : "#60A5FA";
  const flameColorInner = phase === "focus" ? "#FCD34D" : "#93C5FD";

  const wickTop = 335 - candleHeight - 15;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Main Candle SVG */}
        <svg
          width="280"
          height="380"
          viewBox="0 0 280 380"
          className="relative z-10"
        >
          {/* Smoke particles */}
          <AnimatePresence>
            {showSmoke && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={140 + (i - 1.5) * 8}
                    cy={wickTop - 10}
                    r="4"
                    fill="rgba(156, 163, 175, 0.5)"
                    initial={{ opacity: 0, cy: wickTop - 10, r: 2 }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      cy: [wickTop - 10, wickTop - 60],
                      cx: [140 + (i - 1.5) * 8, 140 + (i - 1.5) * 20],
                      r: [2, 6],
                    }}
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

          <defs>
            {/* Candle Body Gradient */}
            <linearGradient id="candleBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={candleColorDark} />
              <stop offset="30%" stopColor={candleColor} />
              <stop offset="70%" stopColor={candleColor} />
              <stop offset="100%" stopColor={candleColorDark} />
            </linearGradient>

            {/* Wax drip gradient */}
            <linearGradient id="waxDrip" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={candleColor} />
              <stop offset="100%" stopColor={candleColorDark} />
            </linearGradient>

            {/* Flame Gradient */}
            <radialGradient id="flameGradient" cx="50%" cy="70%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor={flameColorInner} />
              <stop offset="70%" stopColor={flameColor} />
              <stop offset="100%" stopColor={flameColor} stopOpacity="0" />
            </radialGradient>

            {/* Inner flame */}
            <radialGradient id="innerFlame" cx="50%" cy="80%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor={flameColorInner} />
              <stop offset="100%" stopColor={flameColor} />
            </radialGradient>

            {/* Holder gradient */}
            <linearGradient
              id="holderGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#A1A1AA" />
              <stop offset="50%" stopColor="#71717A" />
              <stop offset="100%" stopColor="#52525B" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Candle Holder Base */}
          <ellipse cx="140" cy="360" rx="60" ry="12" fill="#52525B" />
          <path
            d="M 85,340 L 80,360 Q 80,365 90,365 L 190,365 Q 200,365 200,360 L 195,340 Z"
            fill="url(#holderGradient)"
          />
          <ellipse cx="140" cy="340" rx="55" ry="10" fill="#A1A1AA" />

          {/* Holder Dish */}
          <ellipse cx="140" cy="340" rx="45" ry="8" fill="#71717A" />
          <ellipse cx="140" cy="338" rx="40" ry="6" fill="#52525B" />

          {/* Melted wax pool */}
          {fillPercent < 100 && (
            <ellipse
              cx="140"
              cy="336"
              rx="35"
              ry="5"
              fill={candleColorDark}
              opacity="0.7"
            />
          )}

          {/* Candle Body */}
          {candleHeight > 0 && (
            <rect
              x="110"
              y={335 - candleHeight}
              width="60"
              height={candleHeight}
              rx="4"
              fill="url(#candleBody)"
            />
          )}

          {/* Candle Top (melted pool) */}
          {fillPercent > 5 && (
            <ellipse
              cx="140"
              cy={335 - candleHeight}
              rx="30"
              ry="5"
              fill={candleColorDark}
            />
          )}

          {/* Wax Drips */}
          {fillPercent > 20 && (
            <g transform={`translate(0, ${335 - candleHeight})`}>
              <path
                d="M 115,10 Q 113,30 115,45 Q 117,50 115,10"
                fill="url(#waxDrip)"
                opacity="0.8"
              />
              <path
                d="M 160,15 Q 163,40 160,55 Q 157,45 160,15"
                fill="url(#waxDrip)"
                opacity="0.7"
              />
              <path
                d="M 125,5 Q 122,20 125,30 Q 128,25 125,5"
                fill="url(#waxDrip)"
                opacity="0.6"
              />
            </g>
          )}

          {/* Wick */}
          {candleHeight > 0 && (
            <line
              x1="140"
              y1={wickTop}
              x2="140"
              y2={335 - candleHeight}
              stroke="#1F2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Flame */}
          {showFlame && candleHeight > 0 && (
            <g transform={`translate(0, ${wickTop})`}>
              {/* Outer flame */}
              <motion.path
                d="M 140,0 Q 155,-25 145,-45 Q 140,-55 135,-45 Q 125,-25 140,0"
                fill="url(#flameGradient)"
                filter="url(#flameGlow)"
                animate={
                  isRunning
                    ? {
                        d: [
                          "M 140,0 Q 155,-25 145,-45 Q 140,-55 135,-45 Q 125,-25 140,0",
                          "M 140,0 Q 150,-20 148,-42 Q 140,-52 132,-42 Q 130,-20 140,0",
                          "M 140,0 Q 158,-28 143,-48 Q 140,-58 137,-48 Q 122,-28 140,0",
                          "M 140,0 Q 155,-25 145,-45 Q 140,-55 135,-45 Q 125,-25 140,0",
                        ],
                        scaleY: [1, 1.1, 0.95, 1],
                      }
                    : {}
                }
                transition={
                  isRunning
                    ? {
                        d: {
                          duration: 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        scaleY: { duration: 0.3, repeat: Infinity },
                      }
                    : {}
                }
                style={{ transformOrigin: "140px 0px" }}
              />

              {/* Inner flame */}
              <motion.path
                d="M 140,0 Q 148,-15 143,-28 Q 140,-35 137,-28 Q 132,-15 140,0"
                fill="url(#innerFlame)"
                animate={
                  isRunning
                    ? {
                        d: [
                          "M 140,0 Q 148,-15 143,-28 Q 140,-35 137,-28 Q 132,-15 140,0",
                          "M 140,0 Q 145,-12 144,-25 Q 140,-32 136,-25 Q 135,-12 140,0",
                          "M 140,0 Q 150,-18 142,-30 Q 140,-38 138,-30 Q 130,-18 140,0",
                          "M 140,0 Q 148,-15 143,-28 Q 140,-35 137,-28 Q 132,-15 140,0",
                        ],
                      }
                    : {}
                }
                transition={
                  isRunning
                    ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              />

              {/* Flame core (brightest) */}
              <motion.ellipse
                cx="140"
                cy="-8"
                rx="4"
                ry="8"
                fill="#FFFFFF"
                opacity="0.9"
                animate={
                  isRunning ? { ry: [8, 10, 8], opacity: [0.9, 1, 0.9] } : {}
                }
                transition={
                  isRunning ? { duration: 0.2, repeat: Infinity } : {}
                }
              />
            </g>
          )}

          {/* Candle shine */}
          {fillPercent > 30 && (
            <path
              d="M 120,200 L 120,280"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`translate(0, ${335 - candleHeight - 200})`}
            />
          )}
        </svg>

        {/* Time Display */}
        <div className="mt-6 text-center">
          <div
            className={`text-7xl font-black tracking-tight tabular-nums bg-gradient-to-br ${
              phase === "focus"
                ? "from-amber-500 via-yellow-400 to-orange-500"
                : "from-blue-500 via-sky-400 to-blue-600"
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
                  : "bg-gradient-to-r from-blue-400 to-sky-500"
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
