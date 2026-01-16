import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  FolderPlus,
  FilePlusCorner,
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
      className="group flex items-center gap-1.5 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-amber-50/70 text-gray-700 border border-transparent hover:border-amber-200/50"
      onClick={onToggle}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="p-0.5 hover:bg-amber-100 rounded transition-colors"
      >
        {hasChildren &&
          (isExpanded ? (
            <ChevronDown className="w-4 h-4 text-amber-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-amber-400" />
          ))}
      </button>

      {isExpanded ? (
        <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
      )}

      <span className="flex-1 text-sm font-medium truncate group-hover:text-amber-700">
        {folder.name}
      </span>

      <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateNote();
          }}
          className="p-1.5 hover:bg-blue-100 rounded-md transition-colors group/btn"
          title="New Note"
        >
          <FilePlusCorner className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-blue-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateSubfolder();
          }}
          className="p-1.5 hover:bg-amber-100 rounded-md transition-colors group/btn"
          title="New Subfolder"
        >
          <FolderPlus className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-amber-600" />
        </button>

        <div className="w-px h-3 bg-gray-200 mx-0.5" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit();
          }}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors group/btn"
          title="Rename"
        >
          <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 hover:bg-red-100 rounded-md transition-colors group/btn"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-red-600" />
        </button>
      </div>
    </div>
  );
}
