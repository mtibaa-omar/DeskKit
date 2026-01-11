import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pomodoroKeys } from "./pomodoroKeys";
import { usePomodoroSettings } from "./usePomodoroSettings";
import { pomodoroAPI } from "../../services/api/apiPomodoro";

export function useTimer(userId) {
  const queryClient = useQueryClient();
  const { settings } = usePomodoroSettings();

  const [timeLeft, setTimeLeft] = useState(settings.focus_minutes * 60);
  const [status, setStatus] = useState("idle"); // "idle" | "running" | "paused"
  const [phase, setPhase] = useState("focus"); // "focus" | "break"
  const [linkedTask, setLinkedTask] = useState(null);

  const sessionStartRef = useRef(null);
  const intervalRef = useRef(null);

  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isIdle = status === "idle";

  useEffect(() => {
    if (status === "idle") {
      setTimeLeft(
        phase === "focus"
          ? settings.focus_minutes * 60
          : settings.break_minutes * 60
      );
    }
  }, [settings.focus_minutes, settings.break_minutes, status, phase]);

  const saveSessionMutation = useMutation({
    mutationFn: ({
      userId,
      phase,
      taskId,
      startedAt,
      durationSec,
      completed,
    }) => {
      if (!userId) return Promise.resolve();

      return pomodoroAPI.createSession({
        userId,
        phase,
        task_id: taskId,
        started_at: startedAt,
        ended_at: new Date().toISOString(),
        duration_sec: durationSec,
        completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.sessions });
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.stats });
    },
  });

  const saveSession = useCallback(
    (completed) => {
      if (!sessionStartRef.current) return;

      const durationSec = Math.floor(
        (Date.now() - sessionStartRef.current) / 1000
      );

      if (durationSec >= 60) {
        saveSessionMutation.mutate({
          userId,
          phase,
          taskId: linkedTask?.id || null,
          startedAt: new Date(sessionStartRef.current).toISOString(),
          durationSec,
          completed,
        });
      }

      sessionStartRef.current = null;
    },
    [userId, phase, linkedTask, saveSessionMutation]
  );

  const playSound = useCallback(() => {
    if (!settings.sound_enabled) return;

    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = settings.sound_volume;
      audio.play().catch(() => {});
    } catch {
      throw new Error("Failed to play sound");
    }
  }, [settings.sound_enabled, settings.sound_volume]);

  const switchPhase = useCallback(() => {
    saveSession(true);
    playSound();

    const newPhase = phase === "focus" ? "break" : "focus";
    const newTime =
      newPhase === "focus"
        ? settings.focus_minutes * 60
        : settings.break_minutes * 60;

    setPhase(newPhase);
    setTimeLeft(newTime);

    const shouldAutoStart =
      newPhase === "focus"
        ? settings.auto_start_focus
        : settings.auto_start_break;

    if (shouldAutoStart) {
      sessionStartRef.current = Date.now();
      setStatus("running");
    } else {
      setStatus("idle");
    }
  }, [phase, settings, saveSession, playSound]);

  useEffect(() => {
    if (status !== "running") return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimeout(switchPhase, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [status, switchPhase]);

  const start = useCallback(() => {
    sessionStartRef.current = Date.now();
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    setStatus("running");
  }, []);

  const stop = useCallback(() => {
    setStatus("idle");
    saveSession(false);

    setPhase("focus");
    setTimeLeft(settings.focus_minutes * 60);
  }, [settings.focus_minutes, saveSession]);

  const reset = useCallback(() => {
    setStatus("idle");
    sessionStartRef.current = null;
    setTimeLeft(
      phase === "focus"
        ? settings.focus_minutes * 60
        : settings.break_minutes * 60
    );
  }, [phase, settings.focus_minutes, settings.break_minutes]);

  const skipBreak = useCallback(() => {
    if (phase !== "break") return;

    setStatus("idle");
    sessionStartRef.current = null;
    setPhase("focus");
    setTimeLeft(settings.focus_minutes * 60);
  }, [phase, settings.focus_minutes]);

  const linkTask = useCallback((task) => {
    setLinkedTask(task);
  }, []);

  const unlinkTask = useCallback(() => {
    setLinkedTask(null);
  }, []);
  return {
    timeLeft,
    status,
    isRunning,
    isPaused,
    isIdle,
    phase,
    focusMinutes: settings.focus_minutes,
    breakMinutes: settings.break_minutes,
    linkedTask,
    start,
    pause,
    resume,
    stop,
    reset,
    skipBreak,
    linkTask,
    unlinkTask,
  };
}
