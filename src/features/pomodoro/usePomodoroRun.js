import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { pomodoroAPI } from "../../services/api/apiPomodoro";
import { pomodoroKeys } from "./pomodoroKeys";
import { taskKeys } from "../tasks/taskKeys";
import { usePomodoroSettings } from "./usePomodoroSettings";

export function usePomodoroRun(userId) {
  const queryClient = useQueryClient();
  const { settings } = usePomodoroSettings();

  const {
    data: run,
    isLoading,
    error,
  } = useQuery({
    queryKey: pomodoroKeys.run(userId),
    queryFn: () => pomodoroAPI.getCurrentRun(userId),
    enabled: !!userId,
    refetchInterval: 5000,
  });

  const startMutation = useMutation({
    mutationFn: pomodoroAPI.startRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.run(userId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to start timer");
    },
  });

  const pauseMutation = useMutation({
    mutationFn: pomodoroAPI.pauseRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.run(userId) });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to pause timer");
    },
  });

  const resumeMutation = useMutation({
    mutationFn: pomodoroAPI.resumeRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.run(userId) });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to resume timer");
    },
  });

  const stopMutation = useMutation({
    mutationFn: pomodoroAPI.stopRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.run(userId) });
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.sessions });
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.stats });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to stop timer");
    },
  });

  const completePhaseAndSwitch = useMutation({
    mutationFn: pomodoroAPI.completePhaseAndSwitch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.run(userId) });
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.sessions });
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.stats });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to complete phase");
    },
  });

  return {
    run,
    isLoading,
    error,
    start: (taskId) =>
      startMutation.mutate({
        userId,
        focusMinutes: settings?.focus_minutes || 25,
        taskId,
      }),
    pause: () => run && pauseMutation.mutate(run),
    resume: () => run && resumeMutation.mutate(run),
    stop: () => run && stopMutation.mutate({ run, userId }),
    completePhase: (settings) =>
      run && completePhaseAndSwitch.mutate({ run, settings, userId }),
    isStarting: startMutation.isPending,
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
    isStopping: stopMutation.isPending,
    isCompletingPhase: completePhaseAndSwitch.isPending,
  };
}

export default usePomodoroRun;
