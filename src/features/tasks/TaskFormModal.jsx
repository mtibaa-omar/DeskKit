import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ListTodo, Tag, Calendar, Flag } from "lucide-react";
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
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title || "",
          category_id: task.category_id || "",
          planned_start: task.planned_start
            ? task.planned_start.slice(0, 16)
            : "",
          planned_end: task.planned_end ? task.planned_end.slice(0, 16) : "",
          status: task.status || "todo",
        });
      } else {
        reset({
          title: "",
          category_id: "",
          planned_start: "",
          planned_end: "",
          status: "todo",
        });
      }
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
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: task.id, ...payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  const categoryOptions = [
    { value: "", label: "None" },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "New Task"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ListTodo className="w-4 h-4 text-blue-500" />
            <span>Task Details</span>
          </div>
          <Input
            placeholder="What needs to be done?"
            error={errors.title?.message}
            inputClassName="!py-3.5 !text-base !font-medium !rounded-xl"
            {...register("title", { required: "Title is required" })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Tag className="w-4 h-4 text-purple-500" />
              <span>Category</span>
            </div>
            <Select
              {...register("category_id")}
              options={categoryOptions}
              className="w-full !rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Flag className="w-4 h-4 text-amber-500" />
              <span>Status</span>
            </div>
            <Select
              {...register("status")}
              options={STATUS_OPTIONS}
              className="w-full !rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Schedule</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Start Date
              </label>
              <input
                type="datetime-local"
                {...register("planned_start")}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                End Date
              </label>
              <input
                type="datetime-local"
                {...register("planned_end", {
                  validate: (value) => {
                    if (value && plannedStart && value < plannedStart) {
                      return "End date must be after start date";
                    }
                    return true;
                  },
                })}
                className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none bg-white text-sm transition-colors ${
                  errors.planned_end
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.planned_end && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.planned_end.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            className="!rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
            className="!rounded-xl shadow-lg shadow-blue-500/25"
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
