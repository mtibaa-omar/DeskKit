export const notesKeys = {
  folders: (userId) => ["notes", "folders", userId],
  notes: (userId, folderId) => ["notes", "list", userId, folderId],
  note: (userId, noteId) => ["notes", "detail", userId, noteId],
};
