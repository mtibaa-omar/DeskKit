import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Check, X, Tag, Plus, FolderOpen } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Confirm from "../../components/Confirm";
import Input from "../../components/Input";
import ButtonIcon from "../../components/ButtonIcon";
import { useTaskCategories } from "./useTaskCategories";
import { useTasks } from "./useTasks";

export default function CategoryManagerModal({ isOpen, onClose, userId }) {
  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTaskCategories(userId);

  const { tasks } = useTasks(userId, {});

  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const {
    register: regEdit,
    handleSubmit: submitEdit,
    reset: resetEdit,
    setValue,
  } = useForm();

  const countTasks = (catId) =>
    tasks?.filter((t) => t.category_id === catId).length || 0;

  const onCreateSubmit = (data) => {
    createCategory(data.name);
    reset();
  };

  const onEditSubmit = (data) => {
    if (editingId) {
      updateCategory(editingId, data.editName);
      setEditingId(null);
      resetEdit();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Categories"
        maxWidth="max-w-md sm:max-w-sm"
      >
        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit(onCreateSubmit)} className="flex gap-2.5 mb-5">
            <div className="flex-1">
              <Input
                {...register("name", { required: "Required" })}
                placeholder="New category"
                error={errors.name?.message}
                inputClassName="!py-2.5 sm:!py-2 !text-sm !rounded-lg"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Plus}
              isLoading={isCreating}
              className="!rounded-lg shrink-0"
            >
              Add
            </Button>
          </form>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <FolderOpen className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">No categories yet</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {editingId === cat.id ? (
                    <form
                      onSubmit={submitEdit(onEditSubmit)}
                      className="flex-1 flex gap-1.5 items-center"
                    >
                      <div className="flex-1">
                        <Input
                          {...regEdit("editName", { required: true })}
                          inputClassName="!py-1.5 !text-sm !rounded-md"
                          autoFocus
                        />
                      </div>
                      <ButtonIcon
                        type="submit"
                        icon={Check}
                        variant="success"
                        size="sm"
                        isLoading={isUpdating}
                      />
                      <ButtonIcon
                        type="button"
                        icon={X}
                        variant="ghost-danger"
                        size="sm"
                        onClick={() => { setEditingId(null); resetEdit(); }}
                      />
                    </form>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm text-gray-700 truncate">
                        {cat.name}
                      </span>
                      <span className="text-xs sm:text-[11px] font-medium text-gray-400 tabular-nums">
                        {countTasks(cat.id)}
                      </span>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ButtonIcon
                          icon={Pencil}
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingId(cat.id); setValue("editName", cat.name); }}
                        />
                        <ButtonIcon
                          icon={Trash2}
                          variant="ghost-danger"
                          size="sm"
                          onClick={() => setDeleteConfirm({ isOpen: true, id: cat.id, name: cat.name })}
                          disabled={isDeleting}
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      <Confirm
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })}
        onConfirm={() => {
          if (deleteConfirm.id) deleteCategory(deleteConfirm.id);
          setDeleteConfirm({ isOpen: false, id: null, name: "" });
        }}
        isLoading={isDeleting}
        variant="delete"
        title="Delete Category"
        message={`Delete "${deleteConfirm.name}"?`}
        confirmText="Delete"
      />
    </>
  );
}
