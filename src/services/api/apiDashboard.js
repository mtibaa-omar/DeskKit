import { supabase } from "../supabase";

export const dashboardAPI = {
  getTaskStats: async (userId) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, status, category_id, planned_start, created_at")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    const tasks = data || [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) =>
          t.status !== "done" &&
          t.planned_start &&
          new Date(t.planned_start) < today
      ).length,
      dueToday: tasks.filter((t) => {
        if (!t.planned_start || t.status === "done") return false;
        const taskDate = new Date(t.planned_start);
        return (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      }).length,
      createdThisWeek: tasks.filter((t) => new Date(t.created_at) >= weekAgo)
        .length,
      completedThisWeek: tasks.filter(
        (t) => t.status === "done" && new Date(t.created_at) >= weekAgo
      ).length,
    };
  },

  getPomodoroStats: async (userId, days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("id, phase, duration_sec, completed, started_at")
      .eq("user_id", userId)
      .gte("started_at", startDate.toISOString())
      .order("started_at", { ascending: true });

    if (error) throw new Error(error.message);

    const sessions = data || [];
    const focusSessions = sessions.filter((s) => s.phase === "focus");
    const completedFocus = focusSessions.filter((s) => s.completed);

    const dailyData = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyData[key] = { date: key, focusMinutes: 0, sessions: 0 };
    }

    focusSessions.forEach((session) => {
      const key = session.started_at.split("T")[0];
      if (dailyData[key]) {
        dailyData[key].focusMinutes += Math.round(session.duration_sec / 60);
        dailyData[key].sessions += 1;
      }
    });

    return {
      totalSessions: focusSessions.length,
      completedSessions: completedFocus.length,
      totalFocusMinutes: Math.round(
        focusSessions.reduce((acc, s) => acc + s.duration_sec, 0) / 60
      ),
      avgSessionMinutes:
        focusSessions.length > 0
          ? Math.round(
              focusSessions.reduce((acc, s) => acc + s.duration_sec, 0) /
                60 /
                focusSessions.length
            )
          : 0,
      completionRate:
        focusSessions.length > 0
          ? Math.round((completedFocus.length / focusSessions.length) * 100)
          : 0,
      dailyData: Object.values(dailyData),
    };
  },

  getNotesStats: async (userId) => {
    const [notesResult, foldersResult] = await Promise.all([
      supabase
        .from("notes")
        .select("id, created_at, updated_at")
        .eq("user_id", userId),
      supabase.from("folders").select("id").eq("user_id", userId),
    ]);

    if (notesResult.error) throw new Error(notesResult.error.message);
    if (foldersResult.error) throw new Error(foldersResult.error.message);

    const notes = notesResult.data || [];
    const folders = foldersResult.data || [];

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      totalNotes: notes.length,
      totalFolders: folders.length,
      createdThisWeek: notes.filter((n) => new Date(n.created_at) >= weekAgo)
        .length,
      updatedThisWeek: notes.filter((n) => new Date(n.updated_at) >= weekAgo)
        .length,
    };
  },

  getWhiteboardStats: async (userId) => {
    const { data, error } = await supabase
      .from("whiteboards")
      .select("id, created_at, updated_at")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    const whiteboards = data || [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: whiteboards.length,
      createdThisWeek: whiteboards.filter(
        (w) => new Date(w.created_at) >= weekAgo
      ).length,
      updatedThisWeek: whiteboards.filter(
        (w) => new Date(w.updated_at) >= weekAgo
      ).length,
    };
  },
};
