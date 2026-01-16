import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  ListTodo,
  Tag,
  ChevronDown,
  ChevronRight,
  X,
  CheckCircle,
  Clock,
  CalendarClock,
  CalendarOff,
} from "lucide-react";
import { useUser } from "../features/auth/useUser";
import { useTasks } from "../features/tasks/useTasks";
import { useTaskCategories } from "../features/tasks/useTaskCategories";
import { usePomodoroRun } from "../features/pomodoro/usePomodoroRun";
import TaskCard from "../features/tasks/TaskCard";
import TaskFormModal from "../features/tasks/TaskFormModal";
import CategoryManagerModal from "../features/tasks/CategoryManagerModal";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import { COLOR_SCHEMES } from "../styles/colorSchemes";
import Spinner from "../components/Spinner";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

export default function TasksPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(() => {
    const saved = localStorage.getItem('tasksUpcomingExpanded');
    return saved ? JSON.parse(saved) : false;
  });
  const [isNoDateExpanded, setIsNoDateExpanded] = useState(() => {
    const saved = localStorage.getItem('tasksNoDateExpanded');
    return saved ? JSON.parse(saved) : false;
  });
  const [isDoneExpanded, setIsDoneExpanded] = useState(() => {
    const saved = localStorage.getItem('tasksDoneExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { categories } = useTaskCategories(userId);
  const { tasks, isLoading } = useTasks(userId, {
    status: statusFilter || undefined,
    categoryId: categoryFilter || undefined,
    search: searchQuery || undefined,
  });

  const { run, start: startPomodoro, pause: pausePomodoro, resume: resumePomodoro } = usePomodoroRun(userId);

  const groupedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const groups = {
      current: [],
      upcoming: [],
      noDate: [],
      done: [],
    };

    tasks.forEach((task) => {
      if (!task.planned_start) {
        groups.noDate.push(task);
      } else {
        const taskDate = new Date(task.planned_start);
        taskDate.setHours(0, 0, 0, 0);
        if (taskDate.getTime() === today.getTime()) {
          groups.current.push(task);
        } else if (taskDate > today) {
          groups.upcoming.push(task);
        } else if (task.status === 'done') {
          groups.done.push(task);
        } else {
          groups.current.push(task);
        }
      }
    });

    return groups;
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tasksUpcomingExpanded', JSON.stringify(isUpcomingExpanded));
  }, [isUpcomingExpanded]);

  useEffect(() => {
    localStorage.setItem('tasksNoDateExpanded', JSON.stringify(isNoDateExpanded));
  }, [isNoDateExpanded]);

  useEffect(() => {
    localStorage.setItem('tasksDoneExpanded', JSON.stringify(isDoneExpanded));
  }, [isDoneExpanded]);

  const categoryOptions = useMemo(() => {
    return [
        { value: "", label: "All Categories" },
        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
    ];
  }, [categories]);

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const hasActiveFilters = statusFilter || categoryFilter || searchQuery;
  const activeFiltersCount = [statusFilter, categoryFilter, searchQuery].filter(
    Boolean
  ).length;
  const clearAllFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setSearchQuery("");
  };

  const renderTaskGroup = (title, tasks, Icon, iconColor, isCollapsible = false, isExpanded = true, onToggle = null) => {
    if (tasks.length === 0) return null;

    return (
      <div className="mb-8 last:mb-0">
        <div 
          className={`flex items-center gap-3 mb-4 pl-1 ${
            isCollapsible ? 'cursor-pointer select-none' : ''
          }`}
          onClick={isCollapsible ? onToggle : undefined}
        >
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-200 ${COLOR_SCHEMES[iconColor].bg}${
              isCollapsible ? "group-hover/header:scale-105" : ""
            }`}
          >
            <Icon className={`w-4.5 h-4.5 ${COLOR_SCHEMES[iconColor].text}`} />
          </div>
          <div className="flex items-center gap-2.5 flex-1">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              {title}
            </h2>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${COLOR_SCHEMES[iconColor].lightBg} ${COLOR_SCHEMES[iconColor].text}`}
            >
              {tasks.length}
            </span>
          </div>
          {isCollapsible && (
            <div
              className={`p-1.5 rounded-lg transition-colors ${
                isExpanded ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userId={userId}
                onEdit={handleEditTask}
                onStartPomodoro={startPomodoro}
                onPausePomodoro={pausePomodoro}
                onResumePomodoro={resumePomodoro}
                pomodoroStatus={run?.task_id === task.id ? run.status : null}
                isActivePomodoroTask={run?.task_id === task.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tasks</h1>
            <p className="text-gray-500 font-medium pl-1">
              Manage and track your work efficiently
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              icon={Tag}
              onClick={() => setIsCategoryModalOpen(true)}
              className="shadow-sm border-gray-200"
            >
              Categories
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleNewTask}
              className="shadow-md shadow-blue-500/20"
            >
              New Task
            </Button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 transition-all hover:shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search tasks by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                className="w-full"
                inputClassName="!py-2.5 !border-gray-200 focus:!border-blue-400 !rounded-xl bg-gray-50/50 focus:bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
              <div className="relative">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={STATUS_OPTIONS}
                  className="w-full sm:w-40 !py-2.5 !border-gray-200 !rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white transition-colors"
                />
              </div>
              <div className="relative">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={categoryOptions}
                  className="w-full sm:w-44 !py-2.5 !border-gray-200 !rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white transition-colors"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
              >
                <X className="w-4 h-4" />
                <span>Clear ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ListTodo className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              {searchQuery || statusFilter || categoryFilter
                ? "We couldn't find any tasks matching your filters. Try adjusting them."
                : "You haven't created any tasks yet. Stay organized by adding your first task!"}
            </p>
            {!searchQuery && !statusFilter && !categoryFilter && (
              <Button variant="primary" size="lg" icon={Plus} onClick={handleNewTask} className="shadow-lg shadow-blue-500/30">
                Create First Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {renderTaskGroup(
              "Current",
              groupedTasks.current,
              Clock,
              "blue"
            )}
            {renderTaskGroup(
              "Upcoming",
              groupedTasks.upcoming,
              CalendarClock,
              "emerald",
              true,
              isUpcomingExpanded,
              () => setIsUpcomingExpanded(!isUpcomingExpanded)
            )}
            {renderTaskGroup(
              "No Date",
              groupedTasks.noDate,
              CalendarOff,
              "gray",
              true,
              isNoDateExpanded,
              () => setIsNoDateExpanded(!isNoDateExpanded)
            )}
            {renderTaskGroup(
              "Done",
              groupedTasks.done,
              CheckCircle,
              "emerald",
              true,
              isDoneExpanded,
              () => setIsDoneExpanded(!isDoneExpanded)
            )}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        userId={userId}
        task={editingTask}
      />
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        userId={userId}
      />
    </div>
  );
}
