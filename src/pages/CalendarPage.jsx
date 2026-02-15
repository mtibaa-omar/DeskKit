import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useUser } from "../features/auth/useUser";
import { useTasksByRange, useUpdateTask } from "../features/tasks/useTasks";
import { pomodoroAPI } from "../services/api/apiPomodoro";
import TaskFormModal from "../features/tasks/TaskFormModal";
import Spinner from "../components/Spinner";
import "../styles/calendar.css";

const STATUS_COLORS = {
  todo: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },    
  active: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },    
  done: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },      
  canceled: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },  
};

const POMODORO_COLORS = { bg: "#ede9fe", border: "#8b5cf6", text: "#5b21b6" };

export default function CalendarPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [prefillDate, setPrefillDate] = useState(null);

  const { data: tasks = [], isLoading } = useTasksByRange(
    userId,
    dateRange.start,
    dateRange.end
  );

  const { data: sessions = [] } = useQuery({
    queryKey: ["pomodoro", "sessions", "range", userId, dateRange.start, dateRange.end],
    queryFn: () => pomodoroAPI.getSessionsByRange(userId, dateRange.start, dateRange.end),
    enabled: !!userId && !!dateRange.start && !!dateRange.end,
  });

  const updateTask = useUpdateTask(userId);

  const events = useMemo(() => {
    const taskEvents = tasks
      .filter((task) => task.planned_start)
      .map((task) => {
        const colors = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
        const event = {
          id: task.id,
          title: task.title,
          start: task.planned_start,
          allDay: false,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          extendedProps: { task, type: "task" },
        };
        
        if (task.planned_end) {
          const startTime = new Date(task.planned_start).getTime();
          const endTime = new Date(task.planned_end).getTime();
          if (endTime > startTime) {
            event.end = task.planned_end;
          }
        }
        return event;
      });

    const sessionEvents = sessions.map((session) => {
      const durationMin = Math.round(session.duration_sec / 60);
      const taskTitle = session.tasks?.title;
      const title = taskTitle 
        ? `${taskTitle} (${durationMin}m)` 
        : `Focus (${durationMin}m)`;

      return {
        id: `session-${session.id}`,
        title,
        start: session.started_at,
        end: session.ended_at,
        allDay: false,
        backgroundColor: POMODORO_COLORS.bg,
        borderColor: POMODORO_COLORS.border,
        textColor: POMODORO_COLORS.text,
        editable: false, 
        extendedProps: { session, type: "session" },
      };
    });

    return [...taskEvents, ...sessionEvents];
  }, [tasks, sessions]);

  const handleDatesSet = useCallback((arg) => {
    setDateRange({
      start: arg.startStr,
      end: arg.endStr,
    });
  }, []);

  const handleEventClick = useCallback((info) => {
    if (info.event.extendedProps.type === "session") return;
    
    const task = info.event.extendedProps.task;
    setEditingTask(task);
    setPrefillDate(null);
    setIsModalOpen(true);
  }, []);

  const handleDateClick = useCallback((info) => {
    setEditingTask(null);
    setPrefillDate(info.dateStr);
    setIsModalOpen(true);
  }, []);

  const handleEventDrop = useCallback(
    (info) => {
      const task = info.event.extendedProps.task;
      const newStart = info.event.start?.toISOString();
      const newEnd = info.event.end?.toISOString() || null;

      updateTask.mutate(
        {
          id: task.id,
          planned_start: newStart,
          planned_end: newEnd,
        },
        {
          onError: () => info.revert(),
        }
      );
    },
    [updateTask]
  );

  const handleEventResize = useCallback(
    (info) => {
      const task = info.event.extendedProps.task;
      const newEnd = info.event.end?.toISOString() || null;

      updateTask.mutate(
        {
          id: task.id,
          planned_end: newEnd,
        },
        {
          onError: () => info.revert(),
        }
      );
    },
    [updateTask]
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setPrefillDate(null);
  };

  const prefillTask = prefillDate
    ? {
        planned_start: prefillDate.includes("T")
          ? prefillDate
          : `${prefillDate}T${new Date().toTimeString().slice(0, 5)}`,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendar</h1>
            <p className="text-gray-500 mt-1 font-medium">
              View and manage your tasks on a timeline
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 transition-all hover:shadow-md">
          {isLoading && !dateRange.start ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              datesSet={handleDatesSet}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              editable={true}
              selectable={true}
              dayMaxEvents={3}
              height="auto"
              eventDisplay="block"
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {Object.entries(STATUS_COLORS).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              />
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ backgroundColor: POMODORO_COLORS.bg, borderColor: POMODORO_COLORS.border }}
            />
            <span className="text-sm text-gray-600">Focus Session</span>
          </div>
        </div>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userId={userId}
        task={editingTask || prefillTask}
      />
    </div>
  );
}
