import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "../../services/api/apiDashboard";
import { dashboardKeys } from "./dashboardKeys";

export function useTaskStats(userId) {
  return useQuery({
    queryKey: dashboardKeys.taskStats(userId),
    queryFn: () => dashboardAPI.getTaskStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePomodoroStats(userId, days = 7) {
  return useQuery({
    queryKey: dashboardKeys.pomodoroStats(userId, days),
    queryFn: () => dashboardAPI.getPomodoroStats(userId, days),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useNotesStats(userId) {
  return useQuery({
    queryKey: dashboardKeys.notesStats(userId),
    queryFn: () => dashboardAPI.getNotesStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWhiteboardStats(userId) {
  return useQuery({
    queryKey: dashboardKeys.whiteboardStats(userId),
    queryFn: () => dashboardAPI.getWhiteboardStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}