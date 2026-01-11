import { supabase } from "../supabase";

export const pomodoroAPI = {
  getSettings: async (userId) => {
    const { data, error } = await supabase
      .from("pomodoro_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);

    return data;
  },

  upsertSettings: async ({ userId, ...settings }) => {
    const { data, error } = await supabase
      .from("pomodoro_settings")
      .upsert(
        {
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  getSessions: async (userId, limit = 50) => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("*, tasks(id, title)")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data || [];
  },

  createSession: async ({
    userId,
    phase,
    task_id,
    started_at,
    ended_at,
    duration_sec,
    completed,
  }) => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .insert({
        user_id: userId,
        phase,
        task_id,
        started_at,
        ended_at,
        duration_sec,
        completed,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
