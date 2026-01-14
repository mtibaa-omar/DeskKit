import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { tasksAPI } from "../../services/api/apiTasks";
import { taskKeys } from "./taskKeys";

export function useTaskCategories(userId) {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: taskKeys.categories(userId),
    queryFn: () => tasksAPI.getCategories(userId),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: tasksAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.categories(userId) });
      toast.success("Category created");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: tasksAPI.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.categories(userId) });
      toast.success("Category updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.categories(userId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Category deleted");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete category");
    },
  });

  return {
    categories,
    isLoading,
    error,
    createCategory: (name, sort_order) =>
      createMutation.mutate({ userId, name, sort_order }),
    updateCategory: (id, name, sort_order) =>
      updateMutation.mutate({ id, userId, name, sort_order }),
    deleteCategory: (id) => deleteMutation.mutate({ id, userId }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useTaskCategories;
