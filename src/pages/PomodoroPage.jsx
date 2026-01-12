import { useState, useEffect, useRef } from "react";
import { usePomodoroRun } from "../features/pomodoro/usePomodoroRun";
import { usePomodoroSettings } from "../features/pomodoro/usePomodoroSettings";
import { useUser } from "../features/auth/useUser";
import TimerDisplay from "../features/pomodoro/TimerDisplay";
import TimerControls from "../features/pomodoro/TimerControls";
import TimerSettings from "../features/pomodoro/TimerSettings";
import TaskLinker from "../features/pomodoro/TaskLinker";
import TimerSelector from "../features/pomodoro/TimerSelector";
import PiPTimerContent from "../features/pomodoro/PiPTimer";
import { useDocumentPiP, PiPPortal } from "../features/pomodoro/useDocumentPiP";
import { Minimize2 } from "lucide-react";

export default function PomodoroPage() {
  const [timerType, setTimerType] = useState("simple");
  const [now, setNow] = useState(Date.now());
  const [linkedTaskId, setLinkedTaskId] = useState(null);
  const [linkedTaskTitle, setLinkedTaskTitle] = useState(null);
  const { settings, isLoading: settingsLoading } = usePomodoroSettings();
  const { user } = useUser();

  const {
    pipWindow,
    isSupported,
    isOpen: isPiPOpen,
    openPiP,
    closePiP,
  } = useDocumentPiP();

  const {
    run,
    isLoading: runLoading,
    start,
    pause,
    resume,
    stop,
    completePhase,
    isStarting,
    isPausing,
    isResuming,
    isStopping,
  } = usePomodoroRun(user?.id);

  const lastCompleteKeyRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const computeTimeLeft = () => {
    if (!run) {
      return settings?.focus_minutes * 60 || 25 * 60;
    }

    if (run.status === "running") {
      const endsAt = new Date(run.ends_at).getTime();
      return Math.max(0, Math.floor((endsAt - now) / 1000));
    }

    if (run.status === "paused") {
      return Math.max(0, Math.floor((run.remaining_ms || 0) / 1000));
    }

    return settings?.focus_minutes * 60 || 25 * 60;
  };

  const timeLeft = computeTimeLeft();
  const phase = run?.phase || "focus";
  const isRunning = run?.status === "running";
  const isPaused = run?.status === "paused";
  const hasActiveRun = run && run.status !== "stopped";

  useEffect(() => {
    if (!run || run.status !== "running" || !settings) return;

    const timeLeftMs = new Date(run.ends_at).getTime() - now;
    const key = `${run.id}-${run.phase}-${run.ends_at}`;

    if (timeLeftMs <= 0 && lastCompleteKeyRef.current !== key) {
      lastCompleteKeyRef.current = key;
      completePhase(settings);
    }
  }, [run, now, settings, completePhase]);

  useEffect(() => {
    if (!run || run.status === "stopped") {
      lastCompleteKeyRef.current = null;
    }
  }, [run]);

  const handleStart = () => {
    start(linkedTaskId);
    setLinkedTaskId(null);
    setLinkedTaskTitle(null);
  };

  const handlePause = () => pause();
  const handleResume = () => resume();
  const handleStop = () => stop();

  const handleOpenPiP = async () => {
    await openPiP({ width: 320, height: 60 });
  };

  if (settingsLoading || runLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 md:mb-8 flex items-center justify-center md:justify-end">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {hasActiveRun && isSupported && (
              <button
                onClick={handleOpenPiP}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
                title="Focus Mode (Picture-in-Picture)"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Focus Mode</span>
              </button>
            )}
            <TimerSelector
              selectedTimer={timerType}
              onSelectTimer={setTimerType}
              disabled={hasActiveRun}
            />
            <div className="hidden md:block w-px h-8 bg-gray-200" />
            <TimerSettings
              focusMinutes={settings?.focus_minutes || 25}
              breakMinutes={settings?.break_minutes || 5}
              autoStartBreak={settings?.auto_start_break || false}
              autoStartFocus={settings?.auto_start_focus || false}
              soundEnabled={settings?.sound_enabled ?? true}
              soundVolume={settings?.sound_volume ?? 0.7}
              disabled={hasActiveRun}
            />
            <TaskLinker
              disabled={hasActiveRun}
              linkedTaskId={linkedTaskId}
              linkedTaskTitle={linkedTaskTitle}
              activeRunTaskId={run?.task_id}
              onClearLink={() => {
                setLinkedTaskId(null);
                setLinkedTaskTitle(null);
              }}
              onLinkTask={(id, title) => {
                setLinkedTaskId(id);
                setLinkedTaskTitle(title);
              }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] min-h-[500px]">
          <div className="h-full bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl flex flex-col items-center justify-center px-8 py-12">
            <div className="flex-1 flex items-center justify-center">
              <TimerDisplay
                timeLeft={timeLeft}
                phase={phase}
                status={run?.status}
                linkedTask={run?.task_id ? { id: run.task_id } : null}
                focusMinutes={settings?.focus_minutes || 25}
                breakMinutes={settings?.break_minutes || 5}
                timerType={timerType}
              />
            </div>

            <div className="w-full max-w-md">
              <TimerControls
                run={run}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
                isStarting={isStarting}
                isPausing={isPausing}
                isResuming={isResuming}
                isStopping={isStopping}
              />
            </div>
          </div>
        </div>
      </div>

      <PiPPortal pipWindow={pipWindow}>
        <PiPTimerContent
          timeLeft={timeLeft}
          phase={phase}
          taskName={null}
          isRunning={isRunning}
          onPause={handlePause}
          onResume={handleResume}
          onClose={closePiP}
        />
      </PiPPortal>
    </div>
  );
}
