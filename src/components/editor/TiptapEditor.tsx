"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading2, List, ListOrdered } from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[160px] p-4 text-foreground bg-background rounded-b-lg border-x border-b border-border/50",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync content when it changes outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="h-44 w-full bg-background border border-border/50 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-muted/30 p-2 border-b border-border/50">
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition ${
            editor.isActive("bold") ? "bg-muted text-foreground" : ""
          }`}
          title="Bold"
        >
          <Bold className="size-4" />
        </button>

        {/* Italic Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition ${
            editor.isActive("italic") ? "bg-muted text-foreground" : ""
          }`}
          title="Italic"
        >
          <Italic className="size-4" />
        </button>

        {/* Heading 2 Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition ${
            editor.isActive("heading", { level: 2 }) ? "bg-muted text-foreground" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </button>

        <div className="h-4 w-px bg-border/60 mx-1" />

        {/* Bullet List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition ${
            editor.isActive("bulletList") ? "bg-muted text-foreground" : ""
          }`}
          title="Bullet List"
        >
          <List className="size-4" />
        </button>

        {/* Ordered List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition ${
            editor.isActive("orderedList") ? "bg-muted text-foreground" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="size-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
