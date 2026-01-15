import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  FolderPlus,
} from "lucide-react";
import InlineInput from "./InlineInput";

export default function FolderItem({
  folder,
  isExpanded,
  hasChildren,
  isEditing,
  editingName,
  onToggle,
  onStartEdit,
  onEditNameChange,
  onSaveEdit,
  onCancelEdit,
  onCreateSubfolder,
  onCreateNote,
  onDelete,
}) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5">
        <button className="p-0.5">
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            ))}
        </button>
        <InlineInput
          value={editingName}
          onChange={onEditNameChange}
          onSubmit={onSaveEdit}
          onCancel={onCancelEdit}
          placeholder="Folder name..."
          icon={isExpanded ? FolderOpen : Folder}
          iconClassName="text-amber-500"
          showConfirmButton
        />
      </div>
    );
  }

  return (
    <div
      className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 text-gray-700"
      onClick={onToggle}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="p-0.5 hover:bg-gray-200 rounded transition-colors"
      >
        {hasChildren &&
          (isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ))}
      </button>

      {isExpanded ? (
        <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
      )}

      <span className="flex-1 text-sm font-medium truncate">
        {folder.name}
      </span>

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateSubfolder();
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="New Subfolder"
        >
          <FolderPlus className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateNote();
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="New Note"
        >
          <Plus className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit();
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Rename"
        >
          <Pencil className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-red-100 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
