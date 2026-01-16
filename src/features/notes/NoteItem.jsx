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
      className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all border ${
        isSelected
          ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
          : "hover:bg-gray-50 text-gray-600 border-transparent hover:border-gray-200"
      }`}
    >
      <div className={`flex-shrink-0 transition-colors ${
          isSelected ? "text-blue-500" : "text-gray-300"
        }`}>
        <FileText className="w-4 h-4" />
      </div>

      <span
        className={`flex-1 text-sm truncate font-medium ${
          isSelected ? "text-blue-700" : ""
        }`}
      >
        {note.title}
      </span>

      <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit(note.id, note.title);
          }}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors group/btn"
          title="Rename"
        >
          <Pencil className="w-3 h-3 text-gray-400 group-hover/btn:text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id, note.folder_id);
          }}
          className="p-1.5 hover:bg-red-100 rounded-md transition-colors group/btn"
          title="Delete"
        >
          <Trash2 className="w-3 h-3 text-gray-400 group-hover/btn:text-red-600" />
        </button>
      </div>
    </div>
  );
}
