import { Play, Pause, Square, RotateCcw, SkipForward } from "lucide-react";
import Button from "../../components/Button";

export function TimerControls({
  isRunning,
  isPaused,
  phase,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onSkipBreak,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      {isRunning ? (
        <Button variant="primary" size="lg" icon={Pause} onClick={onPause}>
          Pause
        </Button>
      ) : isPaused ? (
        <Button variant="primary" size="lg" icon={Play} onClick={onResume}>
          Resume
        </Button>
      ) : (
        <Button variant="primary" size="lg" icon={Play} onClick={onStart}>
          {phase === "focus" ? "Start Focus" : "Start Break"}
        </Button>
      )}

      {isRunning && (
        <Button variant="danger" size="lg" icon={Square} onClick={onStop}>
          Stop
        </Button>
      )}

      {(isPaused || (!isRunning && !isPaused)) && (
        <Button
          variant="secondary"
          size="lg"
          icon={RotateCcw}
          onClick={onReset}
        >
          Reset
        </Button>
      )}

      {phase === "break" && (
        <Button
          variant="secondary"
          size="lg"
          icon={SkipForward}
          onClick={onSkipBreak}
        >
          Skip Break
        </Button>
      )}
    </div>
  );
}

export default TimerControls;
