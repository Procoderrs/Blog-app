// src/components/Editor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

export default function Editor({ content, onChange }) {
  console.log('editor render');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter link URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-lg relative">
      {/* INLINE CSS ADDED HERE */}
      <style>
        {`
        /* Toolbar buttons */
        .tiptap-btn {
          padding: 6px 10px;
          border: 1px solid #ccc;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }

        .tiptap-btn:hover {
          background: #f3f3f3;
        }

        /* Active button */
        .tiptap-btn.active {
          background: #4f46e5;
          color: white;
          border-color: #4338ca;
        }

        /* Editor area */
        .ProseMirror {
          min-height: 300px;
          outline: none;
        }

        .ProseMirror p {
          margin: 8px 0;
        }

        /* Headings */
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .ProseMirror h3 {
          font-size: 1.2rem;
          font-weight: bold;
        }

        /* Lists */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 20px;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 20px;
        }

        /* Code block */
        .ProseMirror pre {
          background: #1e1e1e;
          color: white;
          padding: 10px;
          border-radius: 6px;
          overflow-x: auto;
        }
      `}
      </style>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 mt-2 border-b bg-gray-50 w-full">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`tiptap-btn ${editor.isActive("bold") ? "active" : ""}`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`tiptap-btn ${editor.isActive("italic") ? "active" : ""}`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`tiptap-btn ${editor.isActive("underline") ? "active" : ""}`}
        >
          U
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`tiptap-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`tiptap-btn ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tiptap-btn ${editor.isActive("bulletList") ? "active" : ""}`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tiptap-btn ${editor.isActive("orderedList") ? "active" : ""}`}
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`tiptap-btn ${editor.isActive("blockquote") ? "active" : ""}`}
        >
          ❝ Block
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`tiptap-btn ${editor.isActive("codeBlock") ? "active" : ""}`}
        >
          {"</>"}
        </button>

        <button type="button" onClick={setLink} className="tiptap-btn">
          🔗 Link
        </button>

        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="tiptap-btn">
          ↶ Undo
        </button>

        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="tiptap-btn">
          ↷ Redo
        </button>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} className="p-4 min-h-[300px] max-w-full overflow-hidden" />
    </div>
  );
}
