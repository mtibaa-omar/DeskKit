export const taskKeys = {
  all: ["tasks"],
  categories: (userId) => ["tasks", "categories", userId],
  list: (userId, filters = {}) => ["tasks", "list", userId, filters],
  detail: (userId, taskId) => ["tasks", "detail", userId, taskId],
};
