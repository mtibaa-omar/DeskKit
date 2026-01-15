import { useCallback } from "react";

export function useHorizontalRule(editor) {
  const insert = useCallback(() => {
    if (!editor) return false;
    return editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  return { insert };
}
