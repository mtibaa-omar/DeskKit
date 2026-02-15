import { Link2, X, ChevronDown, Timer } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTasks, useTask } from "../tasks/useTasks";
import { useUser } from "../auth/useUser";

export function TaskLinker({
  disabled,
  linkedTaskId,
  linkedTaskTitle,
  activeRunTaskId,
  onClearLink,
  onLinkTask,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const { user } = useUser();
  const { tasks } = useTasks(user?.id, { status: "todo" });
  const { task: activeTask } = useTask(user?.id, activeRunTaskId);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTask = (task) => {
    onLinkTask(task.id, task.title);
    setIsOpen(false);
    setSearch("");
  };

  if (activeRunTaskId && activeTask) {
    return (
      <div className="min-w-[120px] sm:min-w-[160px] max-w-[160px] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm border border-black-100 rounded-xl text-black-700">
        <Timer className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium flex-1 truncate">
          {activeTask.title}
        </span>
      </div>
    );
  }

  if (linkedTaskId && linkedTaskTitle) {
    return (
      <div className="min-w-[120px] sm:min-w-[160px] max-w-[160px] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-black-100 rounded-xl text-black-700">
        <Link2 className="w-4 h-4" />
        <span className="text-sm font-medium flex-1 truncate">
          {linkedTaskTitle}
        </span>
        {!disabled && (
          <button
            onClick={onClearLink}
            className="p-0.5 hover:bg-blue-100 rounded transition-colors"
            title="Unlink task"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center min-w-[120px] sm:min-w-[160px] max-w-[160px] gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Link2 className="w-5 h-5" />
        <span className="text-sm font-medium">Link to Task</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {search ? "No tasks found" : "No tasks available"}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  {task.category && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {task.category.name}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskLinker;
