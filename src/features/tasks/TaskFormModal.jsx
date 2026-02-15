import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useTaskCategories } from "./useTaskCategories";
import { useCreateTask, useUpdateTask } from "./useTasks";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

const RECURRENCE_OPTIONS = [
  { value: "", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
];

export default function TaskFormModal({
  isOpen,
  onClose,
  userId,
  task = null,
}) {
  const { categories } = useTaskCategories(userId);
  const createMutation = useCreateTask(userId);
  const updateMutation = useUpdateTask(userId);

  const isEditing = !!task;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category_id: "",
      planned_start: "",
      planned_end: "",
      status: "todo",
      recurrence: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        task
          ? {
              title: task.title || "",
              category_id: task.category_id || "",
              planned_start: task.planned_start?.slice(0, 16) || "",
              planned_end: task.planned_end?.slice(0, 16) || "",
              status: task.status || "todo",
              recurrence: task.recurrence || "",
            }
          : {
              title: "",
              category_id: "",
              planned_start: "",
              planned_end: "",
              status: "todo",
              recurrence: "",
            }
      );
    }
  }, [isOpen, task, reset]);

  const plannedStart = watch("planned_start");

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      category_id: data.category_id || null,
      planned_start: data.planned_start || null,
      planned_end: data.planned_end || null,
      status: data.status,
      recurrence: data.recurrence || null,
    };

    const opts = { onSuccess: () => onClose() };
    isEditing
      ? updateMutation.mutate({ id: task.id, ...payload }, opts)
      : createMutation.mutate(payload, opts);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const categoryOptions = [
    { value: "", label: "None" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "New Task"}
      maxWidth="max-w-lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="p-4 sm:p-5 space-y-4"
      >
        <Input
          placeholder="Task name"
          error={errors.title?.message}
          inputClassName="!py-3 sm:!py-2.5 !text-sm !rounded-lg"
          {...register("title", { required: "Title is required" })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            {...register("category_id")}
            options={categoryOptions}
            className="!py-2.5 sm:!py-2 !text-sm !rounded-lg !border-gray-200"
          />
          <Select
            {...register("status")}
            options={STATUS_OPTIONS}
            className="!py-2.5 sm:!py-2 !text-sm !rounded-lg !border-gray-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Start
            </label>
            <input
              type="datetime-local"
              {...register("planned_start")}
              className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              End
            </label>
            <input
              type="datetime-local"
              {...register("planned_end", {
                validate: (v) =>
                  !v || !plannedStart || v >= plannedStart || "Must be after start",
              })}
              className={`w-full px-3 py-2.5 sm:py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                errors.planned_end
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.planned_end && (
              <p className="text-red-500 text-xs mt-1">{errors.planned_end.message}</p>
            )}
          </div>
        </div>

        <Select
          {...register("recurrence")}
          options={RECURRENCE_OPTIONS}
          className="w-full !py-2.5 sm:!py-2 !text-sm !rounded-lg !border-gray-200"
        />

        <div className="flex gap-2.5 pt-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            className="!rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
            className="!rounded-lg"
          >
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
