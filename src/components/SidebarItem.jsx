import { Link, useLocation } from "react-router-dom";

export function SidebarItem({ item, isCollapsed, onClick }) {
  const location = useLocation();
  const Icon = item.icon;
  const active = location.pathname === item.path;

  return (
    <li className="relative">
      <Link
        to={item.path}
        onClick={onClick}
        title={isCollapsed ? item.label : undefined}
        className={`
          flex items-center gap-3 rounded-2xl transition-all duration-300 ease-out group relative
          ${isCollapsed ? "justify-center p-3" : "px-4 py-3"}
          ${active
            ? "bg-white/30 backdrop-blur-md shadow-lg shadow-black/5 ring-1 ring-white/40"
            : "hover:bg-white/20 hover:backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
          }
        `}
      >
        {/* Icon container */}
        <div
          className={`
            flex items-center justify-center rounded-xl transition-all duration-300 ease-out
            ${active
              ? "bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg shadow-blue-500/40"
              : "p-2.5 bg-white/40 backdrop-blur-sm group-hover:bg-white/60 group-hover:shadow-md"
            }
          `}
        >
          <Icon
            strokeWidth={active ? 2.2 : 1.8}
            className={`
              w-5 h-5 shrink-0 transition-all duration-300
              ${active
                ? "text-white drop-shadow-sm"
                : "text-gray-600 group-hover:text-gray-800 group-hover:scale-110"
              }
            `}
          />
        </div>

        {/* Label */}
        {!isCollapsed && (
          <span
            className={`
              text-sm font-medium transition-all duration-300 tracking-tight
              ${active
                ? "text-gray-900 font-semibold"
                : "text-gray-600 group-hover:text-gray-900 group-hover:translate-x-0.5"
              }
            `}
          >
            {item.label}
          </span>
        )}

        {/* Active indicator - glowing dot */}
        {active && isCollapsed && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" />
        )}

        {/* Subtle glow effect for active state */}
        {active && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl -z-10" />
        )}
      </Link>
    </li>
  );
}

export default SidebarItem;
