import { useState, useEffect, useCallback } from "react";
import { Save, FileText, Link } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useNote, useUpdateNote } from "./useNotes";
import { useTasks } from "../tasks/useTasks";
import Button from "../../components/Button";
import Select from "../../components/Select";
import EditorToolbar from "./EditorToolbar";
import Spinner from "../../components/Spinner";

export default function NoteEditor({ userId, noteId }) {
  const { data: note, isLoading } = useNote(userId, noteId);
  const updateNote = useUpdateNote(userId);
  const { tasks = [] } = useTasks(userId, {});

  const [title, setTitle] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: note?.content || "",
    immediatelyRender: false,
    onUpdate: () => {
      setHasChanges(true);
    },
  }, [noteId]);

  useEffect(() => {
    if (note && editor) {
      setTitle(note.title || "");
      setLinkedTaskId(note.linked_task_id || "");
      const currentContent = editor.getHTML();
      const newContent = note.content || "";
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
      setHasChanges(false);
    }
  }, [note, editor]);

  useEffect(() => {
    if (!noteId && editor) {
      editor.commands.setContent("");
      setTitle("");
      setLinkedTaskId("");
      setHasChanges(false);
    }
  }, [noteId, editor]);

  const handleSave = useCallback(() => {
    if (!noteId || !editor) return;
    updateNote.mutate(
      {
        id: noteId,
        title,
        content: editor.getHTML(),
        linkedTaskId: linkedTaskId || null,
      },
      {
        onSuccess: () => setHasChanges(false),
      }
    );
  }, [noteId, editor, title, linkedTaskId, updateNote]);

  const handleTaskLink = (e) => {
    setLinkedTaskId(e.target.value);
    setHasChanges(true);
  };

  const taskOptions = [
    { value: "", label: "No linked task" },
    ...tasks.map((t) => ({ value: t.id, label: t.title })),
  ];

  if (!noteId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-gray-100 mb-6">
          <FileText className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">Select a note</h3>
        <p className="text-gray-500 text-center max-w-xs">
          Choose a note from the sidebar to start editing, or create a new one
          in any folder.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <Spinner />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Note not found
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 flex-1 mr-4 truncate">
          {title || "Untitled"}
        </h1>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-amber-600 font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100">
              Unsaved changes
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={Save}
            onClick={handleSave}
            isLoading={updateNote.isPending}
            disabled={!hasChanges}
          >
            Save
          </Button>
        </div>
      </div>

      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          scrollContainer="body"
          scrolling="body"
          className="h-full p-6 prose prose-sm max-w-none focus:outline-none
          [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full 
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0
          "
        />
      </div>

      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5" />
              Link to Task:
            </span>
            <Select
              value={linkedTaskId}
              onChange={handleTaskLink}
              options={taskOptions}
              size="sm"
              className="w-52 !py-2 !rounded-lg text-sm"
            />
          </div> 
      </div>
    </div>
  );
}
