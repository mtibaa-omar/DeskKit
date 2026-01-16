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
  ArrowRight,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, isYesterday, isPast } from "date-fns";
import { useUpdateTask, useDeleteTask } from "./useTasks";
import Confirm from "../../components/Confirm";
import { COLOR_SCHEMES } from "../../styles/colorSchemes";

const STATUS_CONFIG = {
  todo: {
    scheme: COLOR_SCHEMES.gray,
    label: "To Do",
    dotColor: "bg-gray-400",
  },
  active: {
    scheme: COLOR_SCHEMES.blue,
    label: "Active",
    dotColor: "bg-blue-500",
  },
  done: {
    scheme: COLOR_SCHEMES.emerald,
    label: "Done",
    dotColor: "bg-emerald-500",
  },
  canceled: {
    scheme: COLOR_SCHEMES.red,
    label: "Canceled",
    dotColor: "bg-red-400",
  },
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
  const isActive = task.status === "active";
  const isOverdue =
    task.planned_start &&
    isPast(new Date(task.planned_start)) &&
    !isDone &&
    !isCanceled;
  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const scheme = statusConfig.scheme;

  const handleQuickStatusChange = (newStatus) => {
    updateMutation.mutate({
      id: task.id,
      status: newStatus,
    });
  };

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
          ${
            isActivePomodoroTask
              ? "border-blue-400 ring-4 ring-blue-100/60 shadow-lg shadow-blue-500/10"
              : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
          }
          ${isDone || isCanceled ? "opacity-70" : ""}
        `}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.dotColor}`}
        />

        <div className="p-4 pl-5">
          <div className="flex items-start gap-3">
            <button
              onClick={handleMarkDone}
              className={`mt-0.5 flex-shrink-0 transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDone
                  ? "text-emerald-500 hover:text-emerald-600 focus:ring-emerald-500"
                  : "text-gray-300 hover:text-gray-400 hover:scale-110 focus:ring-gray-400"
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Circle className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-sm text-gray-900 leading-snug mb-2 transition-all duration-200 ${
                  isDone ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${scheme.bg} ${scheme.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                  />
                  {statusConfig.label}
                </span>

                {task.category && (
                  <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md text-xs">
                    <Tag className="w-3 h-3" />
                    <span className="truncate max-w-[80px]">
                      {task.category.name}
                    </span>
                  </span>
                )}

                {task.planned_start && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-gray-500 bg-gray-50`}
                  >
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.planned_start)}
                  </span>
                )}

                {isActivePomodoroTask && (
                  <span
                    className={`inline-flex items-center gap-1 font-medium text-xs px-2 py-0.5 rounded-md ${
                      pomodoroStatus === "running"
                        ? "text-blue-600 bg-blue-50"
                        : "text-amber-600 bg-amber-50"
                    }`}
                  >
                    <Timer className="w-3 h-3 animate-pulse" />
                    {pomodoroStatus === "running" ? "Running" : "Paused"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {!isDone && !isCanceled && (
              <>
                {!isActive ? (
                  <button
                    onClick={() => handleQuickStatusChange("active")}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                    title="Mark as Active"
                  >
                    <Zap className="w-3 h-3" />
                    <span className="hidden sm:inline">Start</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuickStatusChange("done")}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                    title="Mark as Done"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span className="hidden sm:inline">Complete</span>
                  </button>
                )}
              </>
            )}
            {isDone && (
              <button
                onClick={() => handleQuickStatusChange("todo")}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
                title="Reopen Task"
              >
                <ArrowRight className="w-3 h-3" />
                <span className="hidden sm:inline">Reopen</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 self-start -mt-1 -mr-1">
            {!isDone && !isCanceled && (
              <>
                {!isActivePomodoroTask && (
                  <button
                    onClick={handleStartPomodoro}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                    title="Start Pomodoro"
                  >
                    <Play className="w-4 h-4" />
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
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDeleteClick}
              disabled={deleteMutation.isPending}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
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