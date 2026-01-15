import { useEffect, useState, useCallback } from "react";

export function useTextAlign(editor) {
  const [currentAlign, setCurrentAlign] = useState("left");

  useEffect(() => {
    if (!editor) {
      setCurrentAlign("left");
      return;
    }

    const updateState = () => {
      if (editor.isActive({ textAlign: "center" })) {
        setCurrentAlign("center");
      } else if (editor.isActive({ textAlign: "right" })) {
        setCurrentAlign("right");
      } else if (editor.isActive({ textAlign: "justify" })) {
        setCurrentAlign("justify");
      } else {
        setCurrentAlign("left");
      }
    };

    updateState();
    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor]);

  const setAlign = useCallback((alignment) => {
    if (!editor) return false;
    return editor.chain().focus().setTextAlign(alignment).run();
  }, [editor]);

  const isActive = useCallback((alignment) => {
    return currentAlign === alignment;
  }, [currentAlign]);

  return {
    currentAlign,
    setAlign,
    isActive,
  };
}
