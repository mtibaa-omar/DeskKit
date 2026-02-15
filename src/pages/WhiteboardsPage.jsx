import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PenTool } from "lucide-react";
import { useUser } from "../features/auth/useUser";
import {
  useWhiteboards,
  useCreateWhiteboard,
  useUpdateWhiteboard,
  useDeleteWhiteboard,
} from "../features/whiteboard/useWhiteboards";
import { useTasks } from "../features/tasks/useTasks";
import { useNotesByFolder } from "../features/notes/useNotes";
import Button from "../components/Button";
import Confirm from "../components/Confirm";
import Spinner from "../components/Spinner";
import WhiteboardCard from "../features/whiteboard/WhiteboardCard";
import CreateWhiteboardModal from "../features/whiteboard/CreateWhiteboardModal";
import RenameWhiteboardModal from "../features/whiteboard/RenameWhiteboardModal";
import LinkWhiteboardModal from "../features/whiteboard/LinkWhiteboardModal";

export default function WhiteboardsPage() {
  const { user, isLoading: userLoading } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();

  const { data: whiteboards = [], isLoading } = useWhiteboards(userId);
  const createWhiteboard = useCreateWhiteboard(userId);
  const updateWhiteboard = useUpdateWhiteboard(userId);
  const deleteWhiteboard = useDeleteWhiteboard(userId);
  const { tasks = [] } = useTasks(userId, {});
  const { data: notes = [] } = useNotesByFolder(userId, null);

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLinkedTaskId, setNewLinkedTaskId] = useState("");
  const [newLinkedNoteId, setNewLinkedNoteId] = useState("");

  // Rename modal state
  const [renameModal, setRenameModal] = useState({ isOpen: false, id: null, title: "" });

  // Link modal state
  const [linkModal, setLinkModal] = useState({ isOpen: false, id: null, taskId: "", noteId: "" });

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const taskOptions = [
    { value: "", label: "No task linked" },
    ...tasks.map((t) => ({ value: t.id, label: t.title })),
  ];

  const noteOptions = [
    { value: "", label: "No note linked" },
    ...notes.map((n) => ({ value: n.id, label: n.title })),
  ];

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createWhiteboard.mutate(
      { title: newTitle, linkedTaskId: newLinkedTaskId || null, linkedNoteId: newLinkedNoteId || null },
      {
        onSuccess: (wb) => {
          handleCloseCreate();
          navigate(`/workspace/whiteboard/${wb.id}`);
        },
      }
    );
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewTitle("");
    setNewLinkedTaskId("");
    setNewLinkedNoteId("");
  };

  const handleRename = () => {
    if (!renameModal.title.trim()) return;
    updateWhiteboard.mutate(
      { id: renameModal.id, title: renameModal.title },
      { onSuccess: () => setRenameModal({ isOpen: false, id: null, title: "" }) }
    );
  };

  const handleSaveLinks = () => {
    updateWhiteboard.mutate(
      { id: linkModal.id, linkedTaskId: linkModal.taskId || null, linkedNoteId: linkModal.noteId || null },
      { onSuccess: () => setLinkModal({ isOpen: false, id: null, taskId: "", noteId: "" }) }
    );
  };

  const handleDelete = () => {
    if (!deleteConfirm.id) return;
    deleteWhiteboard.mutate(deleteConfirm.id, {
      onSuccess: () => setDeleteConfirm({ isOpen: false, id: null }),
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/25">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Whiteboards</h1>
            </div>
            <p className="text-gray-500 font-medium pl-14">Sketch your ideas freely</p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsCreateOpen(true)}
            className="shadow-lg shadow-blue-600/25"
          >
            New Whiteboard
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-gray-500 font-medium">Loading your whiteboards...</p>
            </div>
          </div>
        ) : whiteboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-sm mb-6">
              <PenTool className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to sketch?</h3>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
              Create your first whiteboard and let your ideas flow. Draw, diagram, and brainstorm freely!
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={() => setIsCreateOpen(true)}
              className="shadow-xl shadow-blue-600/30"
            >
              Create Your First Whiteboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whiteboards.map((wb) => (
              <WhiteboardCard
                key={wb.id}
                whiteboard={wb}
                onOpenLink={(w) =>
                  setLinkModal({ isOpen: true, id: w.id, taskId: w.linked_task_id || "", noteId: w.linked_note_id || "" })
                }
                onRename={(w) => setRenameModal({ isOpen: true, id: w.id, title: w.title })}
                onDelete={(id) => setDeleteConfirm({ isOpen: true, id })}
              />
            ))}
          </div>
        )}
      </div>

      <CreateWhiteboardModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        title={newTitle}
        onTitleChange={setNewTitle}
        linkedTaskId={newLinkedTaskId}
        onLinkedTaskIdChange={setNewLinkedTaskId}
        linkedNoteId={newLinkedNoteId}
        onLinkedNoteIdChange={setNewLinkedNoteId}
        taskOptions={taskOptions}
        noteOptions={noteOptions}
        onCreate={handleCreate}
        isLoading={createWhiteboard.isPending}
      />

      <RenameWhiteboardModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, id: null, title: "" })}
        title={renameModal.title}
        onTitleChange={(t) => setRenameModal((prev) => ({ ...prev, title: t }))}
        onSave={handleRename}
        isLoading={updateWhiteboard.isPending}
      />

      <LinkWhiteboardModal
        isOpen={linkModal.isOpen}
        onClose={() => setLinkModal({ isOpen: false, id: null, taskId: "", noteId: "" })}
        taskId={linkModal.taskId}
        noteId={linkModal.noteId}
        onTaskIdChange={(id) => setLinkModal((prev) => ({ ...prev, taskId: id }))}
        onNoteIdChange={(id) => setLinkModal((prev) => ({ ...prev, noteId: id }))}
        taskOptions={taskOptions}
        noteOptions={noteOptions}
        onSave={handleSaveLinks}
        isLoading={updateWhiteboard.isPending}
      />

      <Confirm
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        isLoading={deleteWhiteboard.isPending}
        variant="delete"
        title="Delete Whiteboard"
        message="Are you sure you want to delete this whiteboard? This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
