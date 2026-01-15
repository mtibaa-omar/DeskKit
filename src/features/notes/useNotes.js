import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { notesAPI } from "../../services/api/apiNotes";
import { notesKeys } from "./notesKeys";

export function useNotesByFolder(userId, folderId, filters = {}) {
  return useQuery({
    queryKey: notesKeys.notes(userId, folderId),
    queryFn: () => notesAPI.getNotesByFolder(userId, folderId, filters),
    enabled: !!userId,
  });
}

export function useNote(userId, noteId) {
  return useQuery({
    queryKey: notesKeys.note(userId, noteId),
    queryFn: () => notesAPI.getNoteById(noteId, userId),
    enabled: !!userId && !!noteId,
  });
}

export function useCreateNote(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, title }) =>
      notesAPI.createNote({ userId, folderId, title }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.notes(userId, data.folder_id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.notes(userId, null) });
      toast.success("Note created");
    },
    onError: (error) => {
      if (error.message?.includes("unique constraint")) {
        toast.error("A note with this title already exists in this folder");
      } else {
        toast.error(error.message || "Failed to create note");
      }
    },
  });
}

export function useUpdateNote(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }) =>
      notesAPI.updateNote({ id, userId, ...updates }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.note(userId, data.id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.notes(userId, data.folder_id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.notes(userId, null) });
      toast.success("Note saved");
    },
    onError: (error) => {
      if (error.message?.includes("unique constraint")) {
        toast.error("A note with this title already exists in this folder");
      } else {
        toast.error(error.message || "Failed to save note");
      }
    },
  });
}

export function useDeleteNote(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, folderId }) => notesAPI.deleteNote({ id, userId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.notes(userId, variables.folderId) });
      queryClient.invalidateQueries({ queryKey: notesKeys.notes(userId, null) });
      toast.success("Note deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });
}
