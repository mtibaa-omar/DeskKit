import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { pomodoroAPI } from "../../services/api/apiPomodoro";
import { pomodoroKeys } from "./pomodoroKeys";
import { useUser } from "../auth/useUser";

export function usePomodoroSettings() {
  const { user } = useUser();

  const { data: settings, isLoading } = useQuery({
    queryKey: pomodoroKeys.settings,
    queryFn: () => pomodoroAPI.getSettings(user?.id),
    enabled: !!user?.id,
  });

  return {
    settings: settings || {
      focus_minutes: 25,
      break_minutes: 5,
      auto_start_break: false,
      auto_start_focus: false,
      sound_enabled: true,
      sound_volume: 0.7,
    },
    isLoading,
  };
}

export function useUpdatePomodoroSettings() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { isPending: isUpdating, mutate: updateSettings } = useMutation({
    mutationFn: (settings) =>
      pomodoroAPI.upsertSettings({ userId: user?.id, ...settings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.settings });
      toast.success("Settings saved!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save settings");
    },
  });

  return { isUpdating, updateSettings };
}
