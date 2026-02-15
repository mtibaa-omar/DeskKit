import { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  ListTodo,
  Tag,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  CalendarClock,
  CalendarOff,
  AlertTriangle,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useUser } from "../features/auth/useUser";
import { useTasks, useReorderTasks } from "../features/tasks/useTasks";
import { useTaskCategories } from "../features/tasks/useTaskCategories";
import { usePomodoroRun } from "../features/pomodoro/usePomodoroRun";
import TaskCard from "../features/tasks/TaskCard";
import TaskFormModal from "../features/tasks/TaskFormModal";
import CategoryManagerModal from "../features/tasks/CategoryManagerModal";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Spinner from "../components/Spinner";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

function Collapse({ open, children }) {
  const ref = useRef(null);
  const [h, setH] = useState(open ? "auto" : "0px");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      setH(`${el.scrollHeight}px`);
      const t = setTimeout(() => setH("auto"), 280);
      return () => clearTimeout(t);
    }
    setH(`${el.scrollHeight}px`);
    requestAnimationFrame(() => requestAnimationFrame(() => setH("0px")));
  }, [open]);

  return (
    <div ref={ref} style={{ height: h, overflow: "hidden", transition: "height .28s ease" }}>
      {children}
    </div>
  );
}

export default function TasksPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [expanded, setExpanded] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasksExpanded")) || { upcoming: false, noDate: false, done: false };
    } catch { return { upcoming: false, noDate: false, done: false }; }
  });

  const toggle = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    localStorage.setItem("tasksExpanded", JSON.stringify(expanded));
  }, [expanded]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { categories } = useTaskCategories(userId);
  const { tasks, isLoading } = useTasks(userId, {
    status: statusFilter || undefined,
    categoryId: categoryFilter || undefined,
    search: searchQuery || undefined,
  });

  const { run, start: startPomodoro } = usePomodoroRun(userId);
  const reorderMutation = useReorderTasks(userId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const all = [...tasks];
    const oldIdx = all.findIndex((t) => t.id === active.id);
    const newIdx = all.findIndex((t) => t.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    reorderMutation.mutate(
      arrayMove(all, oldIdx, newIdx).map((t, i) => ({ id: t.id, sort_order: i }))
    );
  };

  const groups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const g = { overdue: [], current: [], upcoming: [], noDate: [], done: [] };

    tasks.forEach((task) => {
      if (task.status === "done") { g.done.push(task); return; }
      if (!task.planned_start) { g.noDate.push(task); return; }
      const d = new Date(task.planned_start);
      d.setHours(0, 0, 0, 0);
      if (d < today && task.status !== "canceled") g.overdue.push(task);
      else if (d.getTime() === today.getTime()) g.current.push(task);
      else if (d > today) g.upcoming.push(task);
      else g.current.push(task);
    });
    return g;
  }, [tasks]);

  const categoryOptions = useMemo(
    () => [{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))],
    [categories]
  );

  const handleNewTask = () => { setEditingTask(null); setIsTaskModalOpen(true); };
  const handleEditTask = (task) => { setEditingTask(task); setIsTaskModalOpen(true); };
  const handleCloseTaskModal = () => { setIsTaskModalOpen(false); setEditingTask(null); };

  const hasFilters = statusFilter || categoryFilter || searchQuery;
  const filtersCount = [statusFilter, categoryFilter, searchQuery].filter(Boolean).length;

  const renderGroup = (label, list, icon, color, collapseKey) => {
    if (!list.length) return null;
    const Icon = icon;
    const isCollapsible = !!collapseKey;
    const isOpen = isCollapsible ? expanded[collapseKey] : true;

    const colorMap = {
      red:     { accent: "border-l-red-400",   bg: "bg-red-50",     text: "text-red-600",     badge: "bg-red-100 text-red-700" },
      blue:    { accent: "border-l-blue-400",   bg: "bg-blue-50",    text: "text-blue-600",    badge: "bg-blue-100 text-blue-700" },
      emerald: { accent: "border-l-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
      gray:    { accent: "border-l-gray-300",   bg: "bg-gray-100",   text: "text-gray-500",    badge: "bg-gray-200 text-gray-600" },
    };
    const c = colorMap[color] || colorMap.gray;

    const content = (
      <SortableContext items={list.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="px-1.5 pb-1.5 sm:px-2 sm:pb-2 2xl:px-2.5 2xl:pb-2.5 space-y-0.5">
          {list.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              userId={userId}
              onEdit={handleEditTask}
              onStartPomodoro={startPomodoro}
              pomodoroStatus={run?.task_id === task.id ? run.status : null}
              isActivePomodoroTask={run?.task_id === task.id}
            />
          ))}
        </div>
      </SortableContext>
    );

    return (
      <section className="mb-5 2xl:mb-6 last:mb-0">
        <div className={`bg-white rounded-xl 2xl:rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-l-[3px] ${c.accent}`}>
          <button
            type="button"
            onClick={isCollapsible ? () => toggle(collapseKey) : undefined}
            className={`flex items-center gap-2.5 w-full px-4 py-3 2xl:px-5 2xl:py-3.5 ${
              isCollapsible ? "cursor-pointer hover:bg-gray-50/50" : "cursor-default"
            } select-none transition-colors`}
          >
            <div className={`flex items-center justify-center w-6 h-6 2xl:w-7 2xl:h-7 rounded-md ${c.bg}`}>
              <Icon className={`w-3.5 h-3.5 ${c.text}`} />
            </div>
            <span className="text-[13px] 2xl:text-sm font-semibold text-gray-700">
              {label}
            </span>
            <span className={`text-[11px] 2xl:text-xs font-bold px-1.5 py-0.5 rounded-md ${c.badge}`}>
              {list.length}
            </span>
            {isCollapsible && (
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform duration-200 ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            )}
          </button>

          {isCollapsible ? <Collapse open={isOpen}>{content}</Collapse> : content}
        </div>
      </section>
    );
  };

  const stats = useMemo(() => {
    if (!tasks.length) return null;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const active = tasks.filter((t) => t.status === "active").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const overdue = groups.overdue.length;
    return { total: tasks.length, todo, active, done, overdue };
  }, [tasks, groups]);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl 2xl:max-w-4xl mx-auto px-4 pb-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 2xl:pb-10">
        <div className="flex items-center justify-between mb-5 sm:mb-6 2xl:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-gray-900 tracking-tight">Tasks</h1>
            {stats && (
              <p className="text-xs sm:text-sm 2xl:text-base text-gray-400 mt-0.5">
                {stats.total} total
                {stats.overdue > 0 && <span className="text-red-500"> · {stats.overdue} overdue</span>}
                {stats.active > 0 && <span> · {stats.active} active</span>}
                {stats.done > 0 && <span> · {stats.done} done</span>}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 2xl:gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={Tag}
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <span className="hidden sm:inline">Categories</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleNewTask}
            >
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-2 2xl:gap-3 mb-5 sm:mb-6 2xl:mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="w-full"
              inputClassName="!py-2.5 sm:!py-2 2xl:!py-2.5 !text-sm !border-gray-200 focus:!border-blue-400 !rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_OPTIONS}
              className="!py-2.5 sm:!py-2 2xl:!py-2.5 !text-sm !border-gray-200 !rounded-lg w-full sm:w-32 2xl:sm:w-36"
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
              className="!py-2.5 sm:!py-2 2xl:!py-2.5 !text-sm !border-gray-200 !rounded-lg w-full sm:w-36 2xl:sm:w-44"
            />
          </div>
          {hasFilters && (
            <button
              onClick={() => { setStatusFilter(""); setCategoryFilter(""); setSearchQuery(""); }}
              className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear ({filtersCount})
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
              <ListTodo className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {hasFilters ? "No matching tasks" : "No tasks yet"}
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mb-6">
              {hasFilters
                ? "Try adjusting your filters to find what you're looking for."
                : "Create your first task to start organizing your work."}
            </p>
            {!hasFilters && (
              <Button variant="primary" size="md" icon={Plus} onClick={handleNewTask}>
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {renderGroup("Overdue",  groups.overdue,   AlertTriangle, "red")}
            {renderGroup("Today",    groups.current,    Clock,         "blue")}
            {renderGroup("Upcoming", groups.upcoming,   CalendarClock, "emerald", "upcoming")}
            {renderGroup("No Date",  groups.noDate,     CalendarOff,   "gray",    "noDate")}
            {renderGroup("Done",     groups.done,       CheckCircle2,  "emerald", "done")}
          </DndContext>
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
