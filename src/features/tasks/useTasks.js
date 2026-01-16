import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { tasksAPI } from "../../services/api/apiTasks";
import { taskKeys } from "./taskKeys";

export function useTasks(userId, filters = {}) {
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: taskKeys.list(userId, filters),
    queryFn: () => tasksAPI.getTasks(userId, filters),
    enabled: !!userId,
  });

  return { tasks, isLoading, error };
}

export function useTask(userId, taskId) {
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: taskKeys.detail(userId, taskId),
    queryFn: () => tasksAPI.getTaskById(taskId, userId),
    enabled: !!userId && !!taskId,
  });

  return { task, isLoading, error };
}

export function useCreateTask(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => tasksAPI.createTask({ userId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task created");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create task");
    },
  });
}

export function useUpdateTask(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => tasksAPI.updateTask({ userId, ...data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(userId, data.id), data);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update task");
    },
  });
}

export function useDeleteTask(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => tasksAPI.deleteTask({ id, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task deleted");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete task");
    },
  });
}

export function useTasksByRange(userId, start, end) {
  return useQuery({
    queryKey: taskKeys.range(userId, start, end),
    queryFn: () => tasksAPI.getTasksByRange(userId, start, end),
    enabled: !!userId && !!start && !!end,
  });
}
