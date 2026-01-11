import { useState } from "react";
import { useTimer } from "../features/pomodoro/useTimer";
import { usePomodoroSettings } from "../features/pomodoro/usePomodoroSettings";
import { useUser } from "../features/auth/useUser";
import TimerDisplay from "../features/pomodoro/TimerDisplay";
import TimerControls from "../features/pomodoro/TimerControls";
import TimerSettings from "../features/pomodoro/TimerSettings";
import TaskLinker from "../features/pomodoro/TaskLinker";
import TimerSelector from "../features/pomodoro/TimerSelector";

export default function PomodoroPage() {
  const [timerType, setTimerType] = useState("coffee");
  const { settings } = usePomodoroSettings();
  const { user } = useUser();

  const {
    timeLeft,
    isRunning,
    isPaused,
    phase,
    focusMinutes,
    breakMinutes,
    linkedTask,
    start,
    pause,
    resume,
    stop,
    reset,
    skipBreak,
    linkTask,
    unlinkTask,
  } = useTimer(user?.id);
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <TimerSelector
              selectedTimer={timerType}
              onSelectTimer={setTimerType}
              disabled={isRunning || isPaused}
            />
            <div className="w-px h-8 bg-gray-200" />
            <TimerSettings
              focusMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              autoStartBreak={settings.auto_start_break}
              autoStartFocus={settings.auto_start_focus}
              soundEnabled={settings.sound_enabled}
              soundVolume={settings.sound_volume}
              disabled={isRunning || isPaused}
            />
            <TaskLinker disabled={isRunning || isPaused} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] min-h-[600px]">
          <div className="h-full bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl flex flex-col items-center justify-center p-8">
            <TimerDisplay
              timeLeft={timeLeft}
              phase={phase}
              linkedTask={linkedTask}
              focusMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              timerType={timerType}
            />

            <div className="mt-12 w-full max-w-md">
              <TimerControls
                isRunning={isRunning}
                isPaused={isPaused}
                phase={phase}
                onStart={start}
                onPause={pause}
                onResume={resume}
                onStop={stop}
                onReset={reset}
                onSkipBreak={skipBreak}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
