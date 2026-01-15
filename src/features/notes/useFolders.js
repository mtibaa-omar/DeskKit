import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { notesAPI } from "../../services/api/apiNotes";
import { notesKeys } from "./notesKeys";

export function useFolders(userId) {
  return useQuery({
    queryKey: notesKeys.folders(userId),
    queryFn: () => notesAPI.getFolders(userId),
    enabled: !!userId,
  });
}

export function useCreateFolder(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }) =>
      notesAPI.createFolder({ userId, name, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.folders(userId) });
      toast.success("Folder created");
    },
    onError: (error) => {
      if (error.message?.includes("unique constraint")) {
        toast.error("A folder with this name already exists here");
      } else {
        toast.error(error.message || "Failed to create folder");
      }
    },
  });
}

export function useUpdateFolder(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }) =>
      notesAPI.updateFolder({ id, userId, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.folders(userId) });
      toast.success("Folder renamed");
    },
    onError: (error) => {
      if (error.message?.includes("unique constraint")) {
        toast.error("A folder with this name already exists here");
      } else {
        toast.error(error.message || "Failed to rename folder");
      }
    },
  });
}

export function useDeleteFolder(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notesAPI.deleteFolder({ id, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.folders(userId) });
      toast.success("Folder deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete folder");
    },
  });
}
