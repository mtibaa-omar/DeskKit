import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Pencil,
  Timer,
  Calendar,
  GripVertical,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateTask, useDeleteTask } from "./useTasks";
import Confirm from "../../components/Confirm";

const NEXT = { todo: "active", active: "done", done: "todo", canceled: "todo" };

export default function TaskCard({
  task,
  userId,
  onEdit,
  onStartPomodoro,
  pomodoroStatus,
  isActivePomodoroTask = false,
  isDraggable = true,
}) {
  const navigate = useNavigate();
  const updateMutation = useUpdateTask(userId);
  const deleteMutation = useDeleteTask(userId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  const cycleStatus = () =>
    updateMutation.mutate({ id: task.id, status: NEXT[task.status] || "todo" });

  const fmtDate = (s) => {
    if (!s) return null;
    const d = new Date(s);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "MMM d");
  };

  const isDone = task.status === "done";
  const isCanceled = task.status === "canceled";
  const isActive = task.status === "active";
  const overdue =
    task.planned_start && isPast(new Date(task.planned_start)) && !isDone && !isCanceled;

  const StatusIcon = () => {
    if (isDone)
      return <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500" strokeWidth={2.5} />;
    if (isActive)
      return <Zap className="w-[18px] h-[18px] text-blue-500" strokeWidth={2} />;
    return <Circle className="w-[18px] h-[18px] text-gray-300" strokeWidth={1.5} />;
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group flex items-center gap-3 sm:gap-2.5 2xl:gap-3 px-3 py-3 sm:py-2.5 2xl:px-4 2xl:py-3 rounded-lg
          transition-all duration-150 cursor-default
          ${isActivePomodoroTask
            ? "bg-blue-50/60 ring-1 ring-blue-200"
            : "hover:bg-gray-50"
          }
          ${isDone || isCanceled ? "opacity-50" : ""}
          ${isDragging ? "shadow-lg ring-1 ring-gray-200 bg-white z-50" : ""}
        `}
      >
        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 p-0.5 text-gray-300 cursor-grab active:cursor-grabbing
              opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={cycleStatus}
          className="shrink-0 p-0.5 hover:scale-110 transition-transform"
          title={isDone ? "Mark todo" : isActive ? "Mark done" : "Mark active"}
        >
          <StatusIcon />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span
            className={`text-[13px] sm:text-sm 2xl:text-base truncate ${
              isDone ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </span>

          {task.category && (
            <span className="hidden sm:inline shrink-0 text-[11px] 2xl:text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {task.category.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 2xl:gap-3 shrink-0">
          {task.planned_start && (
            <span
              className={`text-[11px] sm:text-[11px] flex items-center gap-1 ${
                overdue ? "text-red-500 font-medium" : "text-gray-400"
              }`}
            >
              {overdue ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {fmtDate(task.planned_start)}
            </span>
          )}

          {isActivePomodoroTask && (
            <span className="text-[11px] text-blue-500 font-medium flex items-center gap-1">
              <Timer className="w-3 h-3 animate-pulse" />
              {pomodoroStatus === "running" ? "Running" : "Paused"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {!isDone && !isCanceled && !isActivePomodoroTask && (
            <button
              onClick={() => { onStartPomodoro(task.id); navigate("/pomodoro"); }}
              className="p-2 sm:p-1.5 text-gray-400 hover:text-blue-600 rounded-lg sm:rounded-md hover:bg-blue-50 transition-colors"
              title="Start Pomodoro"
            >
              <Play className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-2 sm:p-1.5 text-gray-400 hover:text-gray-700 rounded-lg sm:rounded-md hover:bg-gray-100 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-2 sm:p-1.5 text-gray-400 hover:text-red-500 rounded-lg sm:rounded-md hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      <Confirm
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { deleteMutation.mutate(task.id); setConfirmOpen(false); }}
        isLoading={deleteMutation.isPending}
        variant="delete"
        title="Delete Task"
        message={`Delete "${task.title}"?`}
        confirmText="Delete"
      />
    </>
  );
}