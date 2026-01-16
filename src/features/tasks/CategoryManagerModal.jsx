import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Check, X, Tag, Plus, FolderOpen } from "lucide-react";
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
                  inputClassName="!py-2.5 !rounded-xl"
                  icon={Tag}
                />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Plus}
              isLoading={isCreating}
              className="!rounded-xl shrink-0"
            >
              Add
            </Button>
          </form>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3" />
              <span className="text-sm">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-700 mb-1">
                No categories yet
              </h4>
              <p className="text-sm text-gray-500">
                Create your first category above to organize your tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Your Categories ({categories.length})
              </div>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
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
                            inputClassName="!py-2 text-sm !rounded-lg"
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
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                          <Tag className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="flex-1 font-medium text-gray-700">
                          {category.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
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
