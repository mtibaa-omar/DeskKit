import { useState } from "react";
import { Highlighter, Ban } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useHighlight } from "./useHighlight";

const HIGHLIGHT_COLORS = [
  { color: "#d1fae5", name: "Green" },      
  { color: "#dbeafe", name: "Blue" },       
  { color: "#fef9c3", name: "Yellow" },    
  { color: "#fce7f3", name: "Pink" },       
  { color: "#fed7aa", name: "Orange" },     
];

export default function HighlightPicker({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useOutsideClick(() => setIsOpen(false));
  const { isActive, currentColor, toggle, remove } = useHighlight(editor);

  if (!editor) return null;

  const handleColorSelect = (color) => {
    toggle(color);
    setIsOpen(false);
  };

  const handleRemoveHighlight = () => {
    remove();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Highlight"
        className={`
          relative p-2 rounded-md transition-all duration-150
          ${isActive
            ? "bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-200"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1
        `}
      >
        <Highlighter className="w-4 h-4" strokeWidth={2} />
        {isActive && currentColor && (
          <span
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center gap-1">
            {HIGHLIGHT_COLORS.map(({ color, name }) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                title={name}
                className={`
                  w-6 h-6 rounded-full transition-transform hover:scale-110
                  ${currentColor === color ? "ring-2 ring-offset-1 ring-indigo-400" : ""}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
            <button
              onClick={handleRemoveHighlight}
              title="Remove highlight"
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
