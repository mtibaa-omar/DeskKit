import { useNavigate } from "react-router-dom";
import {
  PenTool,
  CheckSquare,
  FileText,
  Calendar,
  Link2,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import ButtonIcon from "../../components/ButtonIcon";

export default function WhiteboardCard({ whiteboard, onOpenLink, onRename, onDelete }) {
  const navigate = useNavigate();
  const wb = whiteboard;

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden">
      <div
        onClick={() => navigate(`/workspace/whiteboard/${wb.id}`)}
        className="p-5 pb-4 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/workspace/whiteboard/${wb.id}`);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Open"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 text-lg truncate mb-2">
          {wb.title}
        </h3>

        <div className="flex flex-wrap gap-2 min-h-[28px]">
          {wb.linked_task && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <CheckSquare className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{wb.linked_task.title}</span>
            </span>
          )}
          {wb.linked_note && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
              <FileText className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{wb.linked_note.title}</span>
            </span>
          )}
          {!wb.linked_task && !wb.linked_note && (
            <span className="text-xs text-gray-400 italic">No links</span>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(wb.updated_at).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1">
          <ButtonIcon
            icon={Link2}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLink(wb);
            }}
            title="Link to Task/Note"
          />
          <ButtonIcon
            icon={Pencil}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRename(wb);
            }}
            title="Rename"
          />
          <ButtonIcon
            icon={Trash2}
            variant="ghost-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wb.id);
            }}
            title="Delete"
          />
        </div>
      </div>
    </div>
  );
}
