import { Pencil } from "lucide-react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function RenameWhiteboardModal({
  isOpen,
  onClose,
  title,
  onTitleChange,
  onSave,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Whiteboard" maxWidth="max-w-md">
      <div className="p-6 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Pencil className="w-4 h-4 text-blue-500" />
            <span>New Name</span>
          </div>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            inputClassName="!py-3 !rounded-xl"
            autoFocus
          />
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
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
