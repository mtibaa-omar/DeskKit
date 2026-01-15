import { useEffect, useState, useCallback } from "react";

export function useHeading(editor, level) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("heading", { level }));
    };

    updateState();
    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor, level]);

  const toggle = useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().toggleHeading({ level }).run();
  }, [editor, level]);

  return { isActive, toggle };
}

