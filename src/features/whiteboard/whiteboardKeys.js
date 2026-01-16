export const whiteboardKeys = {
  all: ["whiteboards"],
  list: (userId, folderId = null) => ["whiteboards", "list", userId, folderId],
  detail: (userId, id) => ["whiteboards", "detail", userId, id],
};
