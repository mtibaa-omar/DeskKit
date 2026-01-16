import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { whiteboardsAPI } from "../../services/api/apiWhiteboards";
import { whiteboardKeys } from "./whiteboardKeys";

export function useWhiteboards(userId, folderId = null) {
  return useQuery({
    queryKey: whiteboardKeys.list(userId, folderId),
    queryFn: () => whiteboardsAPI.getWhiteboards(userId, folderId),
    enabled: !!userId,
  });
}

export function useWhiteboard(userId, id) {
  return useQuery({
    queryKey: whiteboardKeys.detail(userId, id),
    queryFn: () => whiteboardsAPI.getWhiteboardById(id, userId),
    enabled: !!userId && !!id,
  });
}

export function useCreateWhiteboard(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => whiteboardsAPI.createWhiteboard({ userId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.all });
      toast.success("Whiteboard created");
    },
    onError: (err) => {
      if (err.message?.includes("unique constraint")) {
        toast.error("A whiteboard with this title already exists");
      } else {
        toast.error(err.message || "Failed to create whiteboard");
      }
    },
  });
}

export function useUpdateWhiteboard(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => whiteboardsAPI.updateWhiteboard({ userId, ...data }),
    onSuccess: (data) => {
      toast.success("Whiteboard saved");
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.all });
      queryClient.setQueryData(whiteboardKeys.detail(userId, data.id), data);
    },
    onError: (err) => {
      if (err.message?.includes("unique constraint")) {
        toast.error("A whiteboard with this title already exists");
      } else {
        toast.error(err.message || "Failed to save whiteboard");
      }
    },
  });
}

export function useDeleteWhiteboard(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => whiteboardsAPI.deleteWhiteboard({ id, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.all });
      toast.success("Whiteboard deleted");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete whiteboard");
    },
  });
}
