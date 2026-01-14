import { supabase } from "../supabase";

export const tasksAPI = {

  getCategories: async (userId) => {
    const { data, error } = await supabase
      .from("task_categories")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  createCategory: async ({ userId, name, sort_order = 0 }) => {
    const { data, error } = await supabase
      .from("task_categories")
      .insert({
        user_id: userId,
        name: name.trim(),
        sort_order,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Category name already exists");
      }
      throw new Error(error.message);
    }
    return data;
  },

  updateCategory: async ({ id, userId, name, sort_order }) => {
    const updates = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name.trim();
    if (sort_order !== undefined) updates.sort_order = sort_order;

    const { data, error } = await supabase
      .from("task_categories")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Category name already exists");
      }
      throw new Error(error.message);
    }
    return data;
  },

  deleteCategory: async ({ id, userId }) => {
    const { error } = await supabase
      .from("task_categories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  },


  getTasks: async (userId, filters = {}) => {
    const { status, categoryId, dateFrom, dateTo, search } = filters;

    let query = supabase
      .from("tasks")
      .select("*, category:task_categories(id, name)")
      .eq("user_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (dateFrom) {
      query = query.gte("planned_start", dateFrom);
    }

    if (dateTo) {
      query = query.lte("planned_start", dateTo);
    }

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    query = query
      .order("planned_start", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  getTaskById: async (id, userId) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, category:task_categories(id, name)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  createTask: async ({
    userId,
    title,
    category_id = null,
    planned_start = null,
    planned_end = null,
    status = "todo",
  }) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: title.trim(),
        category_id,
        planned_start,
        planned_end,
        status,
      })
      .select("*, category:task_categories(id, name)")
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateTask: async ({ id, userId, ...updates }) => {
    const patchData = { updated_at: new Date().toISOString() };

    if (updates.title !== undefined) patchData.title = updates.title.trim();
    if (updates.category_id !== undefined)
      patchData.category_id = updates.category_id;
    if (updates.planned_start !== undefined)
      patchData.planned_start = updates.planned_start;
    if (updates.planned_end !== undefined)
      patchData.planned_end = updates.planned_end;
    if (updates.status !== undefined) patchData.status = updates.status;

    const { data, error } = await supabase
      .from("tasks")
      .update(patchData)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*, category:task_categories(id, name)")
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteTask: async ({ id, userId }) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
