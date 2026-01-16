import { supabase } from "../supabase";

export const whiteboardsAPI = {
  getWhiteboards: async (userId, folderId = null) => {
    let query = supabase
      .from("whiteboards")
      .select(`
        *,
        folder:folders(id, name),
        linked_task:tasks(id, title),
        linked_note:notes(id, title)
      `)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (folderId !== null) {
      query = query.eq("folder_id", folderId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  getWhiteboardById: async (id, userId) => {
    const { data, error } = await supabase
      .from("whiteboards")
      .select(`
        *,
        folder:folders(id, name),
        linked_task:tasks(id, title),
        linked_note:notes(id, title)
      `)
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  createWhiteboard: async ({ userId, title = "Untitled", folderId = null, linkedTaskId = null, linkedNoteId = null }) => {
    const { data, error } = await supabase
      .from("whiteboards")
      .insert({
        user_id: userId,
        title: title.trim(),
        folder_id: folderId,
        linked_task_id: linkedTaskId,
        linked_note_id: linkedNoteId,
        data: {},
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateWhiteboard: async ({ id, userId, ...updates }) => {
    const patchData = { updated_at: new Date().toISOString() };

    if (updates.title !== undefined) patchData.title = updates.title.trim();
    if (updates.data !== undefined) patchData.data = updates.data;
    if (updates.folderId !== undefined) patchData.folder_id = updates.folderId;
    if (updates.linkedTaskId !== undefined) patchData.linked_task_id = updates.linkedTaskId;
    if (updates.linkedNoteId !== undefined) patchData.linked_note_id = updates.linkedNoteId;

    const { data, error } = await supabase
      .from("whiteboards")
      .update(patchData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteWhiteboard: async ({ id, userId }) => {
    const { error } = await supabase
      .from("whiteboards")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
