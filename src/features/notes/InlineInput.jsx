import { Folder, Check } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export default function InlineInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  icon: Icon = Folder,
  iconClassName = "text-amber-500",
  showConfirmButton = false,
}) {
  const ref = useOutsideClick(() => onCancel?.());

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit?.();
    }
    if (e.key === "Escape") {
      onCancel?.();
    }
  };

  return (
    <div ref={ref} className="flex items-center gap-2 px-2 py-1.5">
      <Icon className={`w-4 h-4 shrink-0 ${iconClassName}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-2 py-1 text-sm bg-white border border-blue-400 rounded focus:outline-none"
        autoFocus
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      />
      {showConfirmButton && (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit?.();
          }}
          className="p-1 hover:bg-green-100 rounded transition-colors"
          title="Save"
        >
          <Check className="w-3.5 h-3.5 text-green-600" />
        </button>
      )}
    </div>
  );
}
