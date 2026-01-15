import { useEffect, useState, useCallback } from "react";

export function useBold(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("bold"));
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
    return editor.chain().focus().toggleBold().run();
  }, [editor]);

  return { isActive, toggle };
}

export function useItalic(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("italic"));
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
    return editor.chain().focus().toggleItalic().run();
  }, [editor]);

  return { isActive, toggle };
}

export function useUnderline(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("underline"));
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
    return editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  return { isActive, toggle };
}

export function useStrike(editor) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsActive(false);
      return;
    }

    const updateState = () => {
      setIsActive(editor.isActive("strike"));
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
    return editor.chain().focus().toggleStrike().run();
  }, [editor]);

  return { isActive, toggle };
}
