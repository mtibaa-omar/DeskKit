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
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <Select
            {...register("category_id")}
            options={categoryOptions}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="datetime-local"
            {...register("planned_start")}
          />
          <Input
            label="End Date"
            type="datetime-local"
            error={errors.planned_end?.message}
            {...register("planned_end", {
              validate: (value) => {
                if (value && plannedStart && value < plannedStart) {
                  return "End date must be after start date";
                }
                return true;
              },
            })}
          />
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <Select
            {...register("status")}
            options={STATUS_OPTIONS}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
