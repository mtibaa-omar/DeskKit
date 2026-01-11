import { Link } from "react-router-dom";
import { Home, FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import UserSection from "../features/auth/UserSection";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  {
    label: "Workspace",
    icon: FileText,
    path: "/Workspace",
    children: [
      { path: "/workspace/pomodoro", label: "Pomodoro" },
      { path: "/workspace/tasks", label: "Tasks" },
      { path: "/workspace/notes", label: "Notes" },
      { path: "/workspace/calendar", label: "Calendar" },
      { path: "/workspace/whiteboard", label: "Whiteboard" },
    ],
  },
];

export function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const sidebarWidth = isCollapsed ? "lg:w-20" : "w-72 lg:w-72";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed z-40 flex flex-col transition-all duration-300 ease-out 
                    /* Mobile: Standard Sidebar */
                    top-0 left-0 h-screen border-r border-gray-200 bg-white/95 backdrop-blur-sm
                    /* Desktop: Floating Apple Style */
                    lg:top-4 lg:left-4 lg:h-[calc(100vh-2rem)] lg:rounded-3xl lg:border lg:border-white/20 lg:shadow-2xl lg:bg-white/5 lg:backdrop-blur-3xl lg:overflow-hidden ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 ${sidebarWidth}`}
      >
        <div
          className={`h-20 flex items-center border-b border-white/10 shrink-0 ${
            isCollapsed ? "justify-center px-3" : "justify-between px-5 lg:px-6"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-3.5 hover:opacity-90 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <img
                src="/logo3.png"
                alt="Desk Kit"
                className="object-contain rounded-full transition-transform duration-300 "
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight">
                  Desk Kit
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  A toolbox
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2.5 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <SidebarDropdown
                    key={item.label}
                    item={item}
                    isCollapsed={isCollapsed}
                    onClick={() => setIsOpen(false)}
                  />
                );
              }

              return (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  onClick={() => setIsOpen(false)}
                />
              );
            })}
          </ul>
        </nav>

        {isCollapsed && (
          <div className="px-4 py-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-full p-4 text-gray-500 hover:text-gray-700 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {!isCollapsed && <UserSection />}
      </aside>
    </>
  );
}

export default Sidebar;
