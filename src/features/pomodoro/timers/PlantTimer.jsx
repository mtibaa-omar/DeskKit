import React from "react";

export default function PlantTimer({
  timeLeft,
  phase,
  linkedTask,
  focusMinutes,
  breakMinutes,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds =
    phase === "focus" ? focusMinutes * 60 : breakMinutes * 60;

  const fillPercent = (timeLeft / totalSeconds) * 100;
  const isRunning = timeLeft > 0 && timeLeft < totalSeconds;

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{minutes}</span>
        <span className="text-2xl font-bold">:</span>
        <span className="text-2xl font-bold">{seconds}</span>
      </div>
    </div>
  );
}
