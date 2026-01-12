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

  getCurrentRun: async (userId) => {
    const { data, error } = await supabase
      .from("pomodoro_runs")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "stopped")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  startRun: async ({ userId, focusMinutes, taskId }) => {
    const now = new Date();
    const endsAt = new Date(now.getTime() + focusMinutes * 60 * 1000);

    const { data, error } = await supabase
      .from("pomodoro_runs")
      .upsert(
        {
          user_id: userId,
          task_id: taskId || null,
          phase: "focus",
          status: "running",
          started_at: now.toISOString(),
          ends_at: endsAt.toISOString(),
          remaining_ms: null,
          updated_at: now.toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  pauseRun: async (run) => {
    if (run.status !== "running") {
      throw new Error("Run is not running");
    }

    const now = Date.now();
    const endsAt = new Date(run.ends_at).getTime();
    const remainingMs = Math.floor(Math.max(0, endsAt - now) / 1000) * 1000;

    const { data, error } = await supabase
      .from("pomodoro_runs")
      .update({
        status: "paused",
        remaining_ms: remainingMs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", run.id)
      .eq("status", "running")
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Run was already modified");
    return data;
  },

  resumeRun: async (run) => {
    if (run.status !== "paused") {
      throw new Error("Run is not paused");
    }
    if (!run.remaining_ms || run.remaining_ms <= 0) {
      throw new Error("No remaining time to resume");
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + run.remaining_ms);

    const { data, error } = await supabase
      .from("pomodoro_runs")
      .update({
        status: "running",
        ends_at: endsAt.toISOString(),
        remaining_ms: null,
        updated_at: now.toISOString(),
      })
      .eq("id", run.id)
      .eq("status", "paused")
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Run was already modified");
    return data;
  },

  stopRun: async ({ run, userId }) => {
    if (!run) throw new Error("No active run to stop");

    const now = new Date();
    const startedAt = new Date(run.started_at).getTime();
    const endedAt = now.getTime();

    const durationSec = Math.max(1, Math.floor((endedAt - startedAt) / 1000));

    const { error: sessionError } = await supabase
      .from("pomodoro_sessions")
      .insert({
        user_id: userId,
        task_id: run.task_id,
        phase: run.phase,
        started_at: run.started_at,
        ended_at: now.toISOString(),
        duration_sec: durationSec,
        completed: false,
      });

    if (sessionError) throw new Error(sessionError.message);

    const { data, error } = await supabase
      .from("pomodoro_runs")
      .update({
        status: "stopped",
        remaining_ms: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", run.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  completePhaseAndSwitch: async ({ run, settings, userId }) => {
    const now = new Date();
    const endedAt = run.ends_at;
    const startedAt = run.started_at;
    const durationSec = Math.max(
      1,
      Math.floor(
        (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000
      )
    );

    const { error: sessionError } = await supabase
      .from("pomodoro_sessions")
      .insert({
        user_id: userId,
        task_id: run.task_id,
        phase: run.phase,
        started_at: startedAt,
        ended_at: endedAt,
        duration_sec: durationSec,
        completed: true,
      });

    if (sessionError) throw new Error(sessionError.message);

    const nextPhase = run.phase === "focus" ? "break" : "focus";
    const nextDurationMinutes =
      nextPhase === "focus" ? settings.focus_minutes : settings.break_minutes;
    const nextDurationMs = nextDurationMinutes * 60 * 1000;

    const shouldAutoStart =
      nextPhase === "focus"
        ? settings.auto_start_focus
        : settings.auto_start_break;

    const updateData = {
      phase: nextPhase,
      started_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    if (shouldAutoStart) {
      updateData.status = "running";
      updateData.ends_at = new Date(
        now.getTime() + nextDurationMs
      ).toISOString();
      updateData.remaining_ms = null;
    } else {
      updateData.status = "paused";
      updateData.remaining_ms = nextDurationMs;
      updateData.ends_at = new Date(
        now.getTime() + nextDurationMs
      ).toISOString();
    }

    const { data, error } = await supabase
      .from("pomodoro_runs")
      .update(updateData)
      .eq("id", run.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
