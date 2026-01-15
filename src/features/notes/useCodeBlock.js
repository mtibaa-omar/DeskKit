import { useEffect, useState, useCallback } from "react";

export function useCodeBlock(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("codeBlock"));
    };

    updateState();
    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor]);

  const toggle = useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  return {
    isActive,
    toggle,
  };
}
