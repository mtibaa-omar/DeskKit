import { Link, useLocation, matchPath } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function SidebarDropdown({ item, isCollapsed, onClick }) {
  const location = useLocation();
  const Icon = item.icon;
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive =
    item.children.some((child) => matchPath(child.path, location.pathname)) ||
    location.pathname === item.path;

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => !isCollapsed && setIsExpanded(!isExpanded)}
        title={isCollapsed ? item.label : undefined}
        className={`flex items-center w-full rounded-2xl transition-all duration-300 ease-out group relative ${isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"} ${isActive
          ? "bg-white/30 backdrop-blur-md shadow-lg shadow-black/5 ring-1 ring-white/40"
          : "text-gray-600 hover:bg-white/20 hover:backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
          }
                `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg shadow-blue-500/40" : "p-2.5 bg-white/40 backdrop-blur-sm group-hover:bg-white/60 group-hover:shadow-md"}`}
          >
            <Icon
              className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive ? "text-white drop-shadow-sm" : "text-gray-600 group-hover:text-gray-800 group-hover:scale-110"}`}
            />
          </div>
          {!isCollapsed && (
            <span
              className={`text-sm font-medium tracking-tight transition-all duration-300 ${isActive ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900 group-hover:translate-x-0.5"}`}>
              {item.label}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"} ${isExpanded ? "" : "-rotate-90"}`}
          />
        )}


        {isActive && isCollapsed && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" />
        )}

        {isActive && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl -z-10" />
        )}
      </button>

      {isExpanded && !isCollapsed && (
        <ul className="mt-2 space-y-1">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-4 w-px bg-gradient-to-b from-gray-200 to-transparent" />

            {item.children.map((child) => {
              const isChildActive = location.pathname === child.path;
              return (
                <li key={child.path} className="pl-10 pr-2">
                  <Link
                    to={child.path}
                    onClick={onClick}
                    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl group relative ${isChildActive ? "bg-white/40 text-blue-600 shadow-sm ring-1 ring-white/50 backdrop-blur-sm" : "text-gray-500 hover:text-gray-900 hover:bg-white/20 hover:backdrop-blur-sm hover:translate-x-1"}`}
                  >
                    {isChildActive && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-sm shadow-blue-500/50" />
                    )}
                    <span>{child.label}</span>
                  </Link>
                </li>
              );
            })}
          </div>
        </ul>
      )}
    </li>
  );
}

export default SidebarDropdown;
