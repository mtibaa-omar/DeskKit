import { PenTool, Link2, CheckSquare, FileText } from "lucide-react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";

export default function CreateWhiteboardModal({
  isOpen,
  onClose,
  title,
  onTitleChange,
  linkedTaskId,
  onLinkedTaskIdChange,
  linkedNoteId,
  onLinkedNoteIdChange,
  taskOptions,
  noteOptions,
  onCreate,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Whiteboard" maxWidth="max-w-md">
      <div className="p-6 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <PenTool className="w-4 h-4 text-blue-500" />
            <span>Whiteboard Name</span>
          </div>
          <Input
            placeholder="Enter a name for your whiteboard..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCreate()}
            inputClassName="!py-3 !rounded-xl"
            autoFocus
          />
        </div>

        <div className="p-4 rounded-xl border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Link2 className="w-4 h-4 text-gray-400" />
            <span>Link to (optional)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-blue-500" />
                Task
              </label>
              <Select
                value={linkedTaskId}
                onChange={(e) => onLinkedTaskIdChange(e.target.value)}
                options={taskOptions}
                className="w-full !py-2 !text-sm !rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <FileText className="w-3 h-3 text-amber-500" />
                Note
              </label>
              <Select
                value={linkedNoteId}
                onChange={(e) => onLinkedNoteIdChange(e.target.value)}
                options={noteOptions}
                className="w-full !py-2 !text-sm !rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose} className="!rounded-xl">
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onCreate}
            isLoading={isLoading}
            disabled={!title.trim()}
            className="!rounded-xl shadow-lg shadow-blue-600/25"
          >
            Create Whiteboard
          </Button>
        </div>
      </div>
    </Modal>
  );
}
