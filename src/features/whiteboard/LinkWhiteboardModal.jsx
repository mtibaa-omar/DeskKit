import { CheckSquare, FileText } from "lucide-react";
import Modal from "../../components/Modal";
import Select from "../../components/Select";
import Button from "../../components/Button";

export default function LinkWhiteboardModal({
  isOpen,
  onClose,
  taskId,
  noteId,
  onTaskIdChange,
  onNoteIdChange,
  taskOptions,
  noteOptions,
  onSave,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link Whiteboard" maxWidth="max-w-md">
      <div className="p-6 space-y-5">
        <p className="text-sm text-gray-500">
          Connect this whiteboard to related tasks and notes for quick access.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <span>Link to Task</span>
            </div>
            <Select
              value={taskId}
              onChange={(e) => onTaskIdChange(e.target.value)}
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
              value={noteId}
              onChange={(e) => onNoteIdChange(e.target.value)}
              options={noteOptions}
              className="w-full !rounded-xl"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose} className="!rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onSave}
            isLoading={isLoading}
            className="!rounded-xl shadow-lg shadow-blue-600/25"
          >
            Save Links
          </Button>
        </div>
      </div>
    </Modal>
  );
}
