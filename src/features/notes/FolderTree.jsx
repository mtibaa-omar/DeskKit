import { useState } from "react";
import { Folder, FolderPlus, FileText, NotebookText } from "lucide-react";
import {
  useFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from "./useFolders";
import {
  useNotesByFolder,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "./useNotes";
import Confirm from "../../components/Confirm";
import Spinner from "../../components/Spinner";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import InlineInput from "./InlineInput";

export default function FolderTree({
  userId,
  selectedFolderId,
  selectedNoteId,
  onSelectFolder,
  onSelectNote,
}) {
  const { data: folders = [], isLoading: foldersLoading } = useFolders(userId);
  const { data: allNotes = [] } = useNotesByFolder(userId, null);
  const createFolder = useCreateFolder(userId);
  const updateFolder = useUpdateFolder(userId);
  const deleteFolder = useDeleteFolder(userId);
  const createNote = useCreateNote(userId);
  const updateNote = useUpdateNote(userId);
  const deleteNote = useDeleteNote(userId);

  const [expandedFolders, setExpandedFolders] = useState(new Set());
  
  // Folder creation state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [creatingParentId, setCreatingParentId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  
  // Note creation state
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [creatingNoteInFolderId, setCreatingNoteInFolderId] = useState(null);
  const [newNoteName, setNewNoteName] = useState("");
  
  // Folder editing state
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, folderId: null });
  
  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteName, setEditingNoteName] = useState("");
  const [noteDeleteConfirm, setNoteDeleteConfirm] = useState({ isOpen: false, noteId: null, folderId: null });

  // Folder handlers
  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(folderId) ? next.delete(folderId) : next.add(folderId);
      return next;
    });
  };

  const startCreatingFolder = (parentId = null) => {
    setCreatingParentId(parentId);
    setIsCreatingFolder(true);
    setNewFolderName("");
    if (parentId) {
      setExpandedFolders((prev) => new Set([...prev, parentId]));
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder.mutate({ name: newFolderName, parentId: creatingParentId }, {
      onSuccess: (folder) => {
        setNewFolderName("");
        setIsCreatingFolder(false);
        setCreatingParentId(null);
        if (folder.parent_id) {
          setExpandedFolders((prev) => new Set([...prev, folder.parent_id]));
        }
      },
    });
  };

  const cancelCreatingFolder = () => {
    setIsCreatingFolder(false);
    setNewFolderName("");
    setCreatingParentId(null);
  };

  const startEditingFolder = (folderId, name) => {
    setEditingFolderId(folderId);
    setEditingFolderName(name);
  };

  const handleRenameFolder = () => {
    if (!editingFolderName.trim() || !editingFolderId) return;
    updateFolder.mutate({ id: editingFolderId, name: editingFolderName }, {
      onSuccess: () => {
        setEditingFolderId(null);
        setEditingFolderName("");
      },
    });
  };

  const cancelEditingFolder = () => {
    setEditingFolderId(null);
    setEditingFolderName("");
  };

  const handleDeleteFolder = () => {
    if (!deleteConfirm.folderId) return;
    deleteFolder.mutate(deleteConfirm.folderId, {
      onSuccess: () => {
        setDeleteConfirm({ isOpen: false, folderId: null });
        if (selectedFolderId === deleteConfirm.folderId) {
          onSelectFolder(null);
        }
      },
    });
  };

  // Note handlers
  const startCreatingNote = (folderId) => {
    setCreatingNoteInFolderId(folderId);
    setIsCreatingNote(true);
    setNewNoteName("");
    setExpandedFolders((prev) => new Set([...prev, folderId]));
  };

  const handleCreateNote = () => {
    if (!newNoteName.trim() || !creatingNoteInFolderId) return;
    createNote.mutate({ folderId: creatingNoteInFolderId, title: newNoteName }, {
      onSuccess: (note) => {
        onSelectNote(note.id);
        setIsCreatingNote(false);
        setCreatingNoteInFolderId(null);
        setNewNoteName("");
      },
    });
  };

  const cancelCreatingNote = () => {
    setIsCreatingNote(false);
    setNewNoteName("");
    setCreatingNoteInFolderId(null);
  };

  const startEditingNote = (noteId, title) => {
    setEditingNoteId(noteId);
    setEditingNoteName(title);
  };

  const handleRenameNote = () => {
    if (!editingNoteName.trim() || !editingNoteId) return;
    updateNote.mutate({ id: editingNoteId, title: editingNoteName }, {
      onSuccess: () => {
        setEditingNoteId(null);
        setEditingNoteName("");
      },
    });
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditingNoteName("");
  };

  const handleDeleteNote = () => {
    if (!noteDeleteConfirm.noteId) return;
    deleteNote.mutate({ id: noteDeleteConfirm.noteId, folderId: noteDeleteConfirm.folderId }, {
      onSuccess: () => {
        setNoteDeleteConfirm({ isOpen: false, noteId: null, folderId: null });
        if (selectedNoteId === noteDeleteConfirm.noteId) {
          onSelectNote(null);
        }
      },
    });
  };

  // Tree builder  
  const buildTree = (parentId = null) => {
    return folders
      .filter((f) => f.parent_id === parentId)
      .map((folder) => {
        const isExpanded = expandedFolders.has(folder.id);
        const folderNotes = allNotes.filter((n) => n.folder_id === folder.id);
        const children = buildTree(folder.id);
        const hasChildren = children.length > 0 || folderNotes.length > 0;

        return (
          <div key={folder.id}>
            <FolderItem
              folder={folder}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              isEditing={editingFolderId === folder.id}
              editingName={editingFolderName}
              onToggle={() => toggleFolder(folder.id)}
              onStartEdit={() => startEditingFolder(folder.id, folder.name)}
              onEditNameChange={setEditingFolderName}
              onSaveEdit={handleRenameFolder}
              onCancelEdit={cancelEditingFolder}
              onCreateSubfolder={() => startCreatingFolder(folder.id)}
              onCreateNote={() => startCreatingNote(folder.id)}
              onDelete={() => setDeleteConfirm({ isOpen: true, folderId: folder.id })}
            />

            {isExpanded && (
              <div className="ml-4 border-l border-gray-200 pl-2">
                {/* Subfolder creation input */}
                {isCreatingFolder && creatingParentId === folder.id && (
                  <div className="mb-1">
                    <InlineInput
                      value={newFolderName}
                      onChange={setNewFolderName}
                      onSubmit={handleCreateFolder}
                      onCancel={cancelCreatingFolder}
                      placeholder="Subfolder name..."
                      icon={Folder}
                      iconClassName="text-amber-500"
                    />
                  </div>
                )}

                {/* Notes in this folder */}
                {folderNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    isSelected={selectedNoteId === note.id}
                    isEditing={editingNoteId === note.id}
                    editingName={editingNoteName}
                    onSelect={onSelectNote}
                    onStartEdit={startEditingNote}
                    onEditNameChange={setEditingNoteName}
                    onSaveEdit={handleRenameNote}
                    onCancelEdit={cancelEditingNote}
                    onDelete={(noteId, folderId) => 
                      setNoteDeleteConfirm({ isOpen: true, noteId, folderId })
                    }
                  />
                ))}

                {/* Note creation input */}
                {isCreatingNote && creatingNoteInFolderId === folder.id && (
                  <div className="mb-1">
                    <InlineInput
                      value={newNoteName}
                      onChange={setNewNoteName}
                      onSubmit={handleCreateNote}
                      onCancel={cancelCreatingNote}
                      placeholder="Note name..."
                      icon={FileText}
                      iconClassName="text-gray-400"
                    />
                  </div>
                )}

                {/* Nested subfolders */}
                {children}
              </div>
            )}
          </div>
        );
      });
  };

  if (foldersLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <NotebookText className="w-4.5 h-4.5 text-amber-600" />
          <h2 className="font-bold text-gray-800">Folders</h2>
        </div>
        <button
          onClick={() => startCreatingFolder(null)}
          className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors group"
          title="New Root Folder"
        >
          <FolderPlus className="w-4.5 h-4.5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isCreatingFolder && creatingParentId === null && (
          <div className="mb-2">
            <InlineInput
              value={newFolderName}
              onChange={setNewFolderName}
              onSubmit={handleCreateFolder}
              onCancel={cancelCreatingFolder}
              placeholder="Folder name..."
              icon={Folder}
              iconClassName="text-amber-500"
            />
          </div>
        )}

        {folders.length === 0 && !isCreatingFolder ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No folders yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Create a folder to organize your notes
            </p>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="mt-2 text-blue-500 hover:underline text-sm"
            >
              + Create your first folder
            </button>
          </div>
        ) : (
          buildTree()
        )}
      </div>

      <Confirm
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, folderId: null })}
        onConfirm={handleDeleteFolder}
        isLoading={deleteFolder.isPending}
        variant="delete"
        title="Delete Folder"
        message="Are you sure? All notes in this folder will be deleted."
        confirmText="Delete Folder"
      />

      <Confirm
        isOpen={noteDeleteConfirm.isOpen}
        onClose={() => setNoteDeleteConfirm({ isOpen: false, noteId: null, folderId: null })}
        onConfirm={handleDeleteNote}
        isLoading={deleteNote.isPending}
        variant="delete"
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        confirmText="Delete Note"
      />
    </div>
  );
}
