import { FileText, Pencil, Trash2 } from "lucide-react";
import InlineInput from "./InlineInput";

export default function NoteItem({
  note,
  isSelected,
  isEditing,
  editingName,
  onSelect,
  onStartEdit,
  onEditNameChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  if (isEditing) {
    return (
      <div className="px-2 py-0.5">
        <InlineInput
          value={editingName}
          onChange={onEditNameChange}
          onSubmit={onSaveEdit}
          onCancel={onCancelEdit}
          placeholder="Note title..."
          icon={FileText}
          iconClassName="text-gray-400"
          showConfirmButton
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(note.id)}
      className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 text-blue-700"
          : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      <FileText className="w-4 h-4 text-gray-400 shrink-0" />

      <span className="flex-1 text-sm truncate">{note.title}</span>

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit(note.id, note.title);
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Rename"
        >
          <Pencil className="w-3 h-3 text-gray-500" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id, note.folder_id);
          }}
          className="p-1 hover:bg-red-100 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </button>
      </div>
    </div>
  );
}
