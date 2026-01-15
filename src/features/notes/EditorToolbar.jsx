import { 
  Bold, Italic, Undo2, Redo2, Quote, Code2, List, ListOrdered, 
  Heading1, Heading2, Heading3, Minus, Strikethrough, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify
} from "lucide-react";
import { useEditorHistory } from "./useEditorHistory";
import { useBlockquote } from "./useBlockquote";
import { useCodeBlock } from "./useCodeBlock";
import { useBulletList, useOrderedList } from "./useLists";
import { useHeading } from "./useHeading";
import { useHorizontalRule } from "./useHorizontalRule";

import { useBold, useItalic, useUnderline, useStrike } from "./useTextFormatting";
import { useTextAlign } from "./useTextAlign";
import HighlightPicker from "./HighlightPicker";
import './styles.css'

function ToolbarButton({ onClick, isActive, disabled, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-2 rounded-full transition-all duration-150 text-gray-600 
        ${isActive
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        }
        disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent
        focus:outline-none
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

function ToolbarGroup({ children }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

export default function EditorToolbar({ editor }) {
  const { canUndo, canRedo, undo, redo } = useEditorHistory(editor);
  const { isActive: isBlockquoteActive, toggle: toggleBlockquote } = useBlockquote(editor);
  const { isActive: isCodeBlockActive, toggle: toggleCodeBlock } = useCodeBlock(editor);
  const { isActive: isBulletListActive, toggle: toggleBulletList } = useBulletList(editor);
  const { isActive: isOrderedListActive, toggle: toggleOrderedList } = useOrderedList(editor);
  const { isActive: isH1Active, toggle: toggleH1 } = useHeading(editor, 1);
  const { isActive: isH2Active, toggle: toggleH2 } = useHeading(editor, 2);
  const { isActive: isH3Active, toggle: toggleH3 } = useHeading(editor, 3);
  const { insert: insertHorizontalRule } = useHorizontalRule(editor);
  const { isActive: isBoldActive, toggle: toggleBold } = useBold(editor);
  const { isActive: isItalicActive, toggle: toggleItalic } = useItalic(editor);
  const { isActive: isUnderlineActive, toggle: toggleUnderline } = useUnderline(editor);
  const { isActive: isStrikeActive, toggle: toggleStrike } = useStrike(editor);
  const { isActive: isAlignActive, setAlign } = useTextAlign(editor);

  if (!editor) return null;
    
  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton onClick={toggleH1} isActive={isH1Active} title="Heading 1">
          <Heading1 className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleH2} isActive={isH2Active} title="Heading 2">
          <Heading2 className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleH3} isActive={isH3Active} title="Heading 3">
          <Heading3 className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={toggleBold}
          isActive={isBoldActive}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleItalic}
          isActive={isItalicActive}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleUnderline}
          isActive={isUnderlineActive}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleStrike}
          isActive={isStrikeActive}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
        <HighlightPicker editor={editor} />
      </ToolbarGroup>

      <ToolbarDivider />
      
      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton onClick={toggleBulletList} isActive={isBulletListActive} title="Bullet List">
          <List className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleOrderedList} isActive={isOrderedListActive} title="Numbered List">
          <ListOrdered className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Blocks */}
      <ToolbarGroup>
        <ToolbarButton onClick={toggleBlockquote} isActive={isBlockquoteActive} title="Blockquote">
          <Quote className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleCodeBlock} isActive={isCodeBlockActive} title="Code Block">
          <Code2 className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={insertHorizontalRule} title="Horizontal Rule">
          <Minus className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Text Alignment */}
      <ToolbarGroup>
        <ToolbarButton onClick={() => setAlign("left")} isActive={isAlignActive("left")} title="Align Left">
          <AlignLeft className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={() => setAlign("center")} isActive={isAlignActive("center")} title="Align Center">
          <AlignCenter className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={() => setAlign("right")} isActive={isAlignActive("right")} title="Align Right">
          <AlignRight className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={() => setAlign("justify")} isActive={isAlignActive("justify")} title="Justify">
          <AlignJustify className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
      </ToolbarGroup>

      {/* Spacer */}
      <div className="flex-1" />

      {/* History */}
      <ToolbarGroup>
        <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 className="w-4 h-4" strokeWidth={2} />
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}
