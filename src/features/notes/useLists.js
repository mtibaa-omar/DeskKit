import { useEffect, useState, useCallback } from "react";

export function useBulletList(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("bulletList"));
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
    return editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  return { isActive, toggle };
}

export function useOrderedList(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("orderedList"));
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
    return editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  return { isActive, toggle };
}
