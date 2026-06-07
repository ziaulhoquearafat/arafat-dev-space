"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-background border border-border/50 rounded-lg animate-pulse" />
  ),
});

const modules = {
  toolbar: [
    [{ header: 1 }, { header: 2 }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
];

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const styles = `
    .quill-editor-wrapper .ql-toolbar.ql-snow {
      border: none;
      border-bottom: 1px solid var(--border);
      background-color: var(--muted);
      padding: 8px;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
    .quill-editor-wrapper .ql-container.ql-snow {
      border: none;
      background-color: var(--background);
      min-height: 250px;
      font-family: var(--font-sans);
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
    .quill-editor-wrapper .ql-editor {
      min-height: 250px;
      font-size: 0.875rem;
      line-height: 1.625;
      color: var(--foreground);
    }
    .quill-editor-wrapper .ql-editor.ql-blank::before {
      color: var(--muted-foreground);
      opacity: 0.7;
      font-style: normal;
    }
    .quill-editor-wrapper .ql-snow .ql-stroke {
      stroke: var(--foreground);
      opacity: 0.8;
    }
    .quill-editor-wrapper .ql-snow .ql-fill {
      fill: var(--foreground);
      opacity: 0.8;
    }
    .quill-editor-wrapper .ql-snow .ql-picker {
      color: var(--foreground);
    }
    .quill-editor-wrapper .ql-snow .ql-picker-options {
      background-color: var(--popover);
      border-color: var(--border);
    }
    .quill-editor-wrapper .ql-snow .ql-picker-label {
      border: none;
    }
    .quill-editor-wrapper .ql-snow.ql-toolbar button:hover,
    .quill-editor-wrapper .ql-snow .ql-toolbar button:hover,
    .quill-editor-wrapper .ql-snow.ql-toolbar button:focus,
    .quill-editor-wrapper .ql-snow .ql-toolbar button:focus,
    .quill-editor-wrapper .ql-snow.ql-toolbar button.ql-active,
    .quill-editor-wrapper .ql-snow .ql-toolbar button.ql-active,
    .quill-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover,
    .quill-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label:hover,
    .quill-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .quill-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label.ql-active,
    .quill-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover,
    .quill-editor-wrapper .ql-snow .ql-toolbar .ql-picker-item:hover,
    .quill-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
    .quill-editor-wrapper .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
      color: var(--primary);
    }
    .quill-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
    .quill-editor-wrapper .ql-snow .ql-toolbar button:hover .ql-stroke,
    .quill-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .quill-editor-wrapper .ql-snow .ql-toolbar button.ql-active .ql-stroke,
    .quill-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
    .quill-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .quill-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .quill-editor-wrapper .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke {
      stroke: var(--primary);
    }
    .quill-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
    .quill-editor-wrapper .ql-snow .ql-toolbar button:hover .ql-fill,
    .quill-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .quill-editor-wrapper .ql-snow .ql-toolbar button.ql-active .ql-fill {
      fill: var(--primary);
    }
  `;

  return (
    <div className="quill-editor-wrapper w-full border border-border/50 rounded-lg overflow-hidden flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write something amazing..."}
      />
    </div>
  );
}
