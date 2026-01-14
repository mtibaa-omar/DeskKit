import { X, Unlock, AlertTriangle } from "lucide-react";
import SpinnerMini from "./SpinnerMini";
import { COLOR_SCHEMES } from "../styles/colorSchemes";

const ICON_SIZES = {
  sm: { wrapper: "w-8 h-8", icon: "w-4 h-4" },
  md: { wrapper: "w-12 h-12", icon: "w-6 h-6" },
  lg: { wrapper: "w-16 h-16", icon: "w-8 h-8" },
};

const VARIANTS = {
  default: {
    icon: Unlock,
    iconColor: "blue",
    confirmBgColor: "bg-blue-600 hover:bg-blue-700",
    loadingText: "Loading...",
  },
  delete: {
    icon: AlertTriangle,
    iconColor: "red",
    confirmBgColor: "bg-red-600 hover:bg-red-700",
    title: "Confirm Deletion",
    message:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Delete",
    loadingText: "Deleting...",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "amber",
    confirmBgColor: "bg-amber-600 hover:bg-amber-700",
    loadingText: "Loading...",
  },
  success: {
    icon: Unlock,
    iconColor: "green",
    confirmBgColor: "bg-green-600 hover:bg-green-700",
    loadingText: "Loading...",
  },
};

export default function Confirm({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  variant = "default",
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  icon,
  iconColor,
  confirmBgColor,
  loadingText,
}) {
  if (!isOpen) return null;

  const variantConfig = VARIANTS[variant] || VARIANTS.default;

  const FinalIcon = icon || variantConfig.icon;
  const finalIconColor = iconColor || variantConfig.iconColor;
  const finalConfirmBgColor = confirmBgColor || variantConfig.confirmBgColor;
  const finalTitle = title || variantConfig.title || "Confirm";
  const finalMessage =
    message || variantConfig.message || "Are you sure you want to continue?";
  const finalConfirmText =
    confirmText || variantConfig.confirmText || "Confirm";
  const finalLoadingText = loadingText || variantConfig.loadingText;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`${ICON_SIZES.md.wrapper} ${COLOR_SCHEMES[finalIconColor]?.bg} ${COLOR_SCHEMES[finalIconColor]?.text} rounded-full flex items-center justify-center shrink-0`}
            >
              <FinalIcon className={ICON_SIZES.md.icon} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{finalTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">{finalMessage}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              disabled={isLoading}
              onClick={handleConfirm}
              className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${finalConfirmBgColor}`}
            >
              {isLoading ? (
                <>
                  <SpinnerMini size="sm" />
                  {finalLoadingText}
                </>
              ) : (
                finalConfirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { Confirm };
