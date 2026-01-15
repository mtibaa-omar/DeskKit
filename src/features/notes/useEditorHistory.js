import { useEffect, useState, useCallback } from "react";


export function useEditorHistory(editor) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) {
      setCanUndo(false);
      setCanRedo(false);
      return;
    }

    const updateState = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    updateState();
    editor.on("transaction", updateState);

    return () => {
      editor.off("transaction", updateState);
    };
  }, [editor]);

  const undo = useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().undo().run();
  }, [editor]);

  const redo = useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().redo().run();
  }, [editor]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
