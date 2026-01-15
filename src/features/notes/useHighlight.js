import { useEffect, useState, useCallback } from "react";

export function useHighlight(editor) {
  const [isActive, setIsActive] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      setCurrentColor(null);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("highlight"));
      setCurrentColor(editor.getAttributes("highlight").color || null);
    };

    updateState();
    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor]);

  const toggle = useCallback((color) => {
    if (!editor) return false;
    return editor.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  const remove = useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().unsetHighlight().run();
  }, [editor]);

  return {
    isActive,
    currentColor,
    toggle,
    remove,
  };
}
