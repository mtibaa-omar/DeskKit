import { supabase } from "../supabase";

export const notesAPI = {

  getFolders: async (userId) => {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  createFolder: async ({ userId, name, parentId = null }) => {
    const { data, error } = await supabase
      .from("folders")
      .insert({
        user_id: userId,
        name: name.trim(),
        parent_id: parentId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateFolder: async ({ id, userId, name, parentId }) => {
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (parentId !== undefined) updates.parent_id = parentId;

    const { data, error } = await supabase
      .from("folders")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteFolder: async ({ id, userId }) => {
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  getNotesByFolder: async (userId, folderId, filters = {}) => {
    const { search, sortBy = "updated_at", sortDir = "desc" } = filters;

    let query = supabase
      .from("notes")
      .select("id, title, folder_id, linked_task_id, created_at, updated_at")
      .eq("user_id", userId);

    if (folderId) {
      query = query.eq("folder_id", folderId);
    }

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    query = query.order(sortBy, { ascending: sortDir === "asc" });

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  getNoteById: async (id, userId) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*, folder:folders(id, name), linked_task:tasks(id, title)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  createNote: async ({ userId, folderId, title = "Untitled" }) => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        folder_id: folderId,
        title: title.trim(),
        content: "",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateNote: async ({ id, userId, ...updates }) => {
    const patchData = { updated_at: new Date().toISOString() };

    if (updates.title !== undefined) patchData.title = updates.title.trim();
    if (updates.content !== undefined) patchData.content = updates.content;
    if (updates.folderId !== undefined) patchData.folder_id = updates.folderId;
    if (updates.linkedTaskId !== undefined) patchData.linked_task_id = updates.linkedTaskId;

    const { data, error } = await supabase
      .from("notes")
      .update(patchData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteNote: async ({ id, userId }) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
