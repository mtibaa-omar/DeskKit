import { Link2 } from "lucide-react";
import { useState } from "react";

export function TaskLinker({ disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Link2 className="w-5 h-5" />
        <span className="text-sm font-medium">Link to Task</span>
      </button>
    );
  }
}

export default TaskLinker;
