import { useState } from "react";
import { useUser } from "../features/auth/useUser";
import FolderTree from "../features/notes/FolderTree";
import NoteEditor from "../features/notes/NoteEditor";
import Spinner from "../components/Spinner";

export default function NotesPage() {
  const { user, isLoading: userLoading } = useUser();
  const userId = user?.id;

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Please log in to access notes.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50/30 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-white border-r border-gray-100 flex-shrink-0 overflow-hidden">
          <FolderTree
            userId={userId}
            selectedFolderId={selectedFolderId}
            selectedNoteId={selectedNoteId}
            onSelectFolder={setSelectedFolderId}
            onSelectNote={setSelectedNoteId}
          />
        </div>

        <div className="flex-1 bg-white overflow-hidden">
          <NoteEditor
            userId={userId}
            noteId={selectedNoteId}
            onNoteDeleted={() => setSelectedNoteId(null)}
          />
        </div>
      </div>
    </div>
  );
}
