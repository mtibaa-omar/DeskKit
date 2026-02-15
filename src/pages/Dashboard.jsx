import React, { useState } from "react";
import {
  CheckSquare,
  FileText,
  Layout,
  Timer,
} from "lucide-react";

import { useUser } from "../features/auth/useUser";
import {
  useTaskStats,
  usePomodoroStats,
  useNotesStats,
  useWhiteboardStats,
} from "../features/dashboard/useDashboard";

import StatCard from "../features/dashboard/StatCard";
import Spinner from "../components/Spinner";
import FocusTimeChart from "../features/dashboard/FocusTimeChart";
import TaskTrendChart from "../features/dashboard/TaskTrendChart";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState(7);
  const { user, isLoading: userLoading } = useUser();
  const userId = user?.id;

  const { data: taskStats, isLoading: taskStatsLoading } = useTaskStats(userId);
  const { data: pomodoroStats, isLoading: pomodoroLoading } =
    usePomodoroStats(userId, timeFilter);
  const { data: notesStats, isLoading: notesLoading } = useNotesStats(userId);
  const { data: whiteboardStats, isLoading: whiteboardLoading } =
    useWhiteboardStats(userId);
  
  if (userLoading) {
    return <Spinner />;
  }

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timeFilter);
    return {
      start: startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      end: endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  };

  const dateRange = getDateRange();
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeFilter(7)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeFilter === 7
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => setTimeFilter(30)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeFilter === 30
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => setTimeFilter(90)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeFilter === 90
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Last 90 days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="TASKS"
            value={taskStats?.total || 0}
            subtitle={`${taskStats?.done || 0} completed`}
            icon={CheckSquare}
            color="blue"
            loading={taskStatsLoading}
          />
          <StatCard
            title="FOCUS TIME"
            value={`${pomodoroStats?.totalFocusMinutes || 0}m`}
            subtitle={`${pomodoroStats?.totalSessions || 0} sessions`}
            icon={Timer}
            color="purple"
            loading={pomodoroLoading}
          />
          <StatCard
            title="NOTES"
            value={notesStats?.totalNotes || 0}
            subtitle={`${notesStats?.totalFolders || 0} folders`}
            icon={FileText}
            color="green"
            loading={notesLoading}
          />
          <StatCard
            title="WHITEBOARDS"
            value={whiteboardStats?.total || 0}
            subtitle={`${whiteboardStats?.updatedThisWeek || 0} updated`}
            icon={Layout}
            color="orange"
            loading={whiteboardLoading}
          />
        </div>
        <div>
          <FocusTimeChart
            data={pomodoroStats?.dailyData}
            loading={pomodoroLoading}
            title={`Focus Time from ${dateRange.start} to ${dateRange.end}`}
          />
        </div>

        <div>
          <TaskTrendChart
            data={taskStats?.dailyData}
            loading={taskStatsLoading}
            title={`Task Trend from ${dateRange.start} to ${dateRange.end}`}
          />
        </div>
      </div>
    </div>
  );
}
