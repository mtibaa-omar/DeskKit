import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Play,
  Trash2,
  Edit2,
  Timer,
  Calendar,
  Tag,
  Pause,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { useUpdateTask, useDeleteTask } from "./useTasks";
import Confirm from "../../components/Confirm";
import { COLOR_SCHEMES } from "../../styles/colorSchemes";

const STATUS_SCHEMES = {
  todo: COLOR_SCHEMES.gray,
  active: COLOR_SCHEMES.blue,
  done: COLOR_SCHEMES.emerald,
  canceled: COLOR_SCHEMES.red,
};

const STATUS_LABELS = {
  todo: "To Do",
  active: "Active",
  done: "Done",
  canceled: "Canceled",
};

export default function TaskCard({
  task,
  userId,
  onEdit,
  onStartPomodoro,
  onPausePomodoro,
  onResumePomodoro,
  pomodoroStatus,
  isActivePomodoroTask = false,
}) {
  const navigate = useNavigate();
  const updateMutation = useUpdateTask(userId);
  const deleteMutation = useDeleteTask(userId);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleMarkDone = () => {
    updateMutation.mutate({
      id: task.id,
      status: task.status === "done" ? "todo" : "done",
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(task.id);
    setIsDeleteConfirmOpen(false);
  };

  const handleStartPomodoro = () => {
    onStartPomodoro(task.id);
    navigate("/workspace/pomodoro");
  };

  const handlePausePomodoro = () => {
    onPausePomodoro();
  };

  const handleResumePomodoro = () => {
    onResumePomodoro();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    }
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    }
    if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    }
    
    return format(date, "MMM d, h:mm a");
  };

  const isDone = task.status === "done";
  const isCanceled = task.status === "canceled";
  const scheme = STATUS_SCHEMES[task.status] || COLOR_SCHEMES.gray;

  return (
    <>
      <div
        className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md
          ${isActivePomodoroTask ? "border-blue-400 ring-4 ring-blue-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200 shadow-sm"}
          ${isDone || isCanceled ? "opacity-75 bg-gray-50/50" : ""}
        `}
      >
        <div className="p-4 flex items-start gap-3.5">
          <button
            onClick={handleMarkDone}
            className={`mt-0.5 flex-shrink-0 transition-colors duration-200 rounded-full focus:outline-none ${
              isDone ? "text-emerald-500 hover:text-emerald-600" : "text-gray-300 hover:text-gray-400"
            }`}
          >
            {isDone ? (
              <CheckCircle className="w-5.5 h-5.5" weight="fill" />
            ) : (
              <Circle className="w-5.5 h-5.5" />
            )}
          </button>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3
              className={`font-medium text-base text-gray-900 leading-snug mb-2 transition-colors duration-200 ${
                isDone ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2.5 text-sm">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${scheme.bg} ${scheme.text} border ${scheme.border} border-opacity-20`}
              >
                {STATUS_LABELS[task.status]}
              </span>

              {task.category && (
                <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <span className="truncate max-w-[120px] font-medium text-xs">{task.category.name}</span>
                </span>
              )}

              {task.planned_start && (
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatDate(task.planned_start)}</span>
                </span>
              )}

              {isActivePomodoroTask && (
                <span className={`flex items-center gap-1.5 font-semibold text-xs px-2 py-0.5 rounded-full ${
                    pomodoroStatus === "running" ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50"
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  {pomodoroStatus === "running" ? "Running" : "Paused"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 self-start -mt-1 -mr-1">
            {!isDone && !isCanceled && (
              <>
                {!isActivePomodoroTask && (
                   <button
                    onClick={handleStartPomodoro}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Start Pomodoro"
                  >
                    <Play className="w-4.5 h-4.5" />
                  </button>
                )}
                {isActivePomodoroTask && pomodoroStatus === "running" && (
                    <button
                        onClick={handlePausePomodoro}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Pause Timer"
                    >
                        <Pause className="w-4.5 h-4.5" />
                    </button>
                )}
                {isActivePomodoroTask && pomodoroStatus === "paused" && (
                    <button
                        onClick={handleResumePomodoro}
                        className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Resume Timer"
                    >
                        <Play className="w-4.5 h-4.5" />
                    </button>
                )}
              </>
            )}

            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={handleDeleteClick}
              disabled={deleteMutation.isPending}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      <Confirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        variant="delete"
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
      />
    </>)
}