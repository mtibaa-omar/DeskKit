export const dashboardKeys = {
  all: ["dashboard"],
  taskStats: (userId) => [...dashboardKeys.all, "taskStats", userId],
  pomodoroStats: (userId, days) => [
    ...dashboardKeys.all,
    "pomodoroStats",
    userId,
    days,
  ],
  notesStats: (userId) => [...dashboardKeys.all, "notesStats", userId],
  whiteboardStats: (userId) => [
    ...dashboardKeys.all,
    "whiteboardStats",
    userId,
  ],
  taskTrend: (userId, days) => [
    ...dashboardKeys.all,
    "taskTrend",
    userId,
    days,
  ],
  recentActivity: (userId) => [...dashboardKeys.all, "recentActivity", userId],
  upcomingTasks: (userId) => [...dashboardKeys.all, "upcomingTasks", userId],
  categoryDistribution: (userId) => [
    ...dashboardKeys.all,
    "categoryDistribution",
    userId,
  ],
};
