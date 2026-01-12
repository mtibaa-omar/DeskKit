import { Play, Pause, Square } from "lucide-react";
import Button from "../../components/Button";

export function TimerControls({
  run,
  onStart,
  onPause,
  onResume,
  onStop,
  isStarting,
  isPausing,
  isResuming,
  isStopping,
}) {
  const status = run?.status;
  const phase = run?.phase || "focus";

  if (!run || status === "stopped") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Button
          variant="primary"
          size="lg"
          icon={Play}
          onClick={onStart}
          isLoading={isStarting}
          className="rounded-full shadow-lg shadow-zinc-200"
        >
          Start Focus
        </Button>
      </div>
    );
  }

  if (status === "running") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Button
          variant="secondary"
          size="lg"
          icon={Pause}
          onClick={onPause}
          isLoading={isPausing}
          disabled={isStopping}
          className="rounded-full"
        >
          Pause
        </Button>
        <Button
          variant="danger"
          size="lg"
          icon={Square}
          onClick={onStop}
          isLoading={isStopping}
          disabled={isPausing}
          className="rounded-full"
        >
          Stop
        </Button>
      </div>
    );
  }

  if (status === "paused") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Button
          variant="primary"
          size="lg"
          icon={Play}
          onClick={onResume}
          isLoading={isResuming}
          disabled={isStopping}
          className="rounded-full shadow-lg shadow-zinc-200"
        >
          Resume {phase === "focus" ? "Focus" : "Break"}
        </Button>
        <Button
          variant="danger"
          size="lg"
          icon={Square}
          onClick={onStop}
          isLoading={isStopping}
          disabled={isResuming}
          className="rounded-full"
        >
          Stop
        </Button>
      </div>
    );
  }

  return null;
}

export default TimerControls;
