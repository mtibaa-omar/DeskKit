import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Maximize,
  Minimize,
  Link2,
  FileText,
  CheckSquare,
  PenTool,
} from "lucide-react";
import { Tldraw, squashRecordDiffs } from "tldraw";
import "tldraw/tldraw.css";
import { useUser } from "../features/auth/useUser";
import {
  useWhiteboard,
  useUpdateWhiteboard,
} from "../features/whiteboard/useWhiteboards";
import { useTasks } from "../features/tasks/useTasks";
import { useNotesByFolder } from "../features/notes/useNotes";
import Button from "../components/Button";
import ButtonIcon from "../components/ButtonIcon";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import Select from "../components/Select";

function isPlainObjectEmpty(obj) {
  for (const key in obj) return false;
  return true;
}

function SaveButton({ editor, onSave, isSaving }) {
  if (!editor) return null;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const rUnsavedChanges = useRef({ added: {}, removed: {}, updated: {} });

  useEffect(() => {
    const handleDocumentChange = (diff) => {
      squashRecordDiffs([rUnsavedChanges.current, diff.changes], {
        mutateFirstDiff: true,
      });
      setHasUnsavedChanges(
        !isPlainObjectEmpty(rUnsavedChanges.current.added) ||
          !isPlainObjectEmpty(rUnsavedChanges.current.removed) ||
          !isPlainObjectEmpty(rUnsavedChanges.current.updated)
      );
    };

    return editor.store.listen(handleDocumentChange, { scope: "document" });
  }, [editor]);

  const handleSave = useCallback(() => {
    const snapshot = editor.getSnapshot();
    onSave(snapshot, () => {
      setHasUnsavedChanges(false);
      rUnsavedChanges.current = { added: {}, removed: {}, updated: {} };
    });
  }, [editor, onSave]);

  return (
    <Button
      variant="primary"
      size="sm"
      icon={Save}
      onClick={handleSave}
      isLoading={isSaving}
      disabled={!hasUnsavedChanges}
    >
      Save
    </Button>
  );
}

export default function WhiteboardEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;

  const { data: whiteboard, isLoading } = useWhiteboard(userId, id);
  const updateWhiteboard = useUpdateWhiteboard(userId);
  const { data: tasks = [] } = useTasks(userId, {});
  const { data: notes = [] } = useNotesByFolder(userId, null);

  const [editor, setEditor] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkedTaskId, setLinkedTaskId] = useState("");
  const [linkedNoteId, setLinkedNoteId] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (whiteboard) {
      setLinkedTaskId(whiteboard.linked_task_id || "");
      setLinkedNoteId(whiteboard.linked_note_id || "");
    }
  }, [whiteboard]);

  useEffect(() => {
    if (editor && whiteboard?.data?.snapshot && !isInitialized) {
      try {
        editor.loadSnapshot(whiteboard.data.snapshot);
        setIsInitialized(true);
      } catch (e) {
        console.error("Failed to load snapshot:", e);
        setIsInitialized(true);
      }
    }
  }, [editor, whiteboard, isInitialized]);

  const handleMount = useCallback((editorInstance) => {
    setEditor(editorInstance);
  }, []);

  const handleSave = useCallback(
    (snapshot, onSuccess) => {
      updateWhiteboard.mutate({ id, data: { snapshot } }, { onSuccess });
    },
    [id, updateWhiteboard]
  );

  const handleSaveLinks = useCallback(() => {
    updateWhiteboard.mutate(
      {
        id,
        linkedTaskId: linkedTaskId || null,
        linkedNoteId: linkedNoteId || null,
      },
      {
        onSuccess: () => setIsLinkModalOpen(false),
      }
    );
  }, [id, linkedTaskId, linkedNoteId, updateWhiteboard]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const taskOptions = [
    { value: "", label: "No task linked" },
    ...tasks.map((t) => ({ value: t.id, label: t.title })),
  ];

  const noteOptions = [
    { value: "", label: "No note linked" },
    ...notes.map((n) => ({ value: n.id, label: n.title })),
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-gray-500 font-medium">Loading whiteboard...</p>
        </div>
      </div>
    );
  }

  if (!whiteboard) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 gap-6 p-6">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
          <PenTool className="w-10 h-10 text-blue-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Whiteboard not found
          </h2>
          <p className="text-gray-500">
            This whiteboard may have been deleted or doesn't exist.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/workspace/whiteboard")}
          className="!rounded-xl"
        >
          Back to Whiteboards
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-[calc(100vh-4rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <ButtonIcon
            icon={ArrowLeft}
            variant="ghost"
            size="md"
            onClick={() => navigate("/workspace/whiteboard")}
            title="Back"
            className="hover:bg-gray-100"
          />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <PenTool className="w-4 h-4 text-blue-600" />
            </div>
            <h1 className="font-bold text-gray-900 truncate max-w-[200px]">
              {whiteboard.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 ml-2">
            {whiteboard.linked_task && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <CheckSquare className="w-3 h-3" />
                <span className="truncate max-w-[100px]">
                  {whiteboard.linked_task.title}
                </span>
              </span>
            )}
            {whiteboard.linked_note && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[100px]">
                  {whiteboard.linked_note.title}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ButtonIcon
            icon={Link2}
            variant="ghost"
            size="md"
            onClick={() => setIsLinkModalOpen(true)}
            title="Link to Task/Note"
            className="hover:bg-blue-50 hover:text-blue-600"
          />
          <ButtonIcon
            icon={isFullscreen ? Minimize : Maximize}
            variant="ghost"
            size="md"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="hover:bg-gray-100"
          />
          <SaveButton
            editor={editor}
            onSave={handleSave}
            isSaving={updateWhiteboard.isPending}
          />
        </div>
      </div>

      <div className="flex-1 relative">
        <Tldraw
          licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
          onMount={handleMount}
        />
      </div>

      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Link Whiteboard"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <span>Link to Task</span>
            </div>
            <Select
              value={linkedTaskId}
              onChange={(e) => setLinkedTaskId(e.target.value)}
              options={taskOptions}
              className="w-full !rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Link to Note</span>
            </div>
            <Select
              value={linkedNoteId}
              onChange={(e) => setLinkedNoteId(e.target.value)}
              options={noteOptions}
              className="w-full !rounded-xl"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsLinkModalOpen(false)}
              className="!rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSaveLinks}
              isLoading={updateWhiteboard.isPending}
              className="!rounded-xl shadow-lg shadow-blue-600/25"
            >
              Save Links
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
