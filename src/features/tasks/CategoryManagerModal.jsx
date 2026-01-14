import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Check, X } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Confirm from "../../components/Confirm";
import Input from "../../components/Input";
import ButtonIcon from "../../components/ButtonIcon";
import { useTaskCategories } from "./useTaskCategories";

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

  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, categoryId: null, categoryName: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
  } = useForm();

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

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditValue("editName", category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetEdit();
  };

  const openDeleteConfirm = (category) => {
    setDeleteConfirm({ isOpen: true, categoryId: category.id, categoryName: category.name });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, categoryId: null, categoryName: "" });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.categoryId) {
      deleteCategory(deleteConfirm.categoryId);
      closeDeleteConfirm();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Categories"
        maxWidth="max-w-md"
      >
        <div className="p-6">
          <form
            onSubmit={handleSubmit(onCreateSubmit)}
            className="flex gap-2 mb-6"
          >
            <div className="flex-1">
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="New category name"
                  error={errors.name?.message}
                />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isCreating}
            >
              Add
            </Button>
          </form>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories yet. Create one above.
            </div>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  {editingId === category.id ? (
                    <form
                      onSubmit={handleSubmitEdit(onEditSubmit)}
                      className="flex-1 flex gap-2 items-center"
                    >
                      <div className="flex-1">
                          <Input
                            {...registerEdit("editName", {
                              required: "Name is required",
                            })}
                            inputClassName="py-1.5 text-sm"
                            autoFocus
                          />
                      </div>
                      <ButtonIcon
                        type="submit"
                        icon={Check}
                        variant="success"
                        size="sm"
                        isLoading={isUpdating}
                        title="Save"
                      />
                      <ButtonIcon
                        type="button"
                        icon={X}
                        variant="ghost-danger"
                        size="sm"
                        onClick={cancelEdit}
                        title="Cancel"
                      />
                    </form>
                  ) : (
                    <>
                      <span className="flex-1 font-medium text-gray-700">
                        {category.name}
                      </span>
                      <ButtonIcon
                        icon={Pencil}
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(category)}
                        title="Edit"
                      />
                      <ButtonIcon
                        icon={Trash2}
                        variant="ghost-danger"
                        size="sm"
                        onClick={() => openDeleteConfirm(category)}
                        disabled={isDeleting}
                        title="Delete"
                      />
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
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        variant="delete"
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteConfirm.categoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loadingText="Deleting..."
      />
    </>
  );
}
