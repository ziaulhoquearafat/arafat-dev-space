"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Italic, Heading, Link as LinkIcon, Code as CodeIcon, List, Eye, Edit3, Columns } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [view, setView] = useState<"edit" | "preview" | "split">("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    onChange(text.substring(0, start) + replacement + text.substring(end));
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const toolbarItems = [
    { icon: <Bold className="size-4" />, label: "Bold", id: "bold" },
    { icon: <Italic className="size-4" />, label: "Italic", id: "italic" },
    { icon: <Heading className="size-4" />, label: "Heading", id: "heading" },
    { icon: <LinkIcon className="size-4" />, label: "Link", id: "link" },
    { icon: <CodeIcon className="size-4" />, label: "Code", id: "code" },
    { icon: <List className="size-4" />, label: "List", id: "list" },
  ];

  const handleToolbarAction = (id: string) => {
    switch (id) {
      case "bold":
        insertText("**", "**");
        break;
      case "italic":
        insertText("*", "*");
        break;
      case "heading":
        insertText("\n## ", "\n");
        break;
      case "link":
        insertText("[", "](url)");
        break;
      case "code":
        insertText("\n```javascript\n", "\n```\n");
        break;
      case "list":
        insertText("\n- ", "\n");
        break;
    }
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col min-h-[450px]">
      {/* Editor Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-4 py-2 gap-2 select-none">
        {/* Markdown Toolbar */}
        <div className="flex items-center gap-1">
          {toolbarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToolbarAction(item.id)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setView("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              view === "edit"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="size-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setView("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              view === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setView("split")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              view === "split"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="size-3.5" />
            Split
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[380px] overflow-hidden">
        {/* Text Area (Edit Pane) */}
        {(view === "edit" || view === "split") && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write details case study in Markdown format..."
            className={`w-full h-full min-h-[380px] p-4 bg-background text-sm text-foreground placeholder:text-muted-foreground/45 font-mono leading-relaxed outline-none resize-none border-0 ${
              view === "split" ? "border-r border-border md:block" : ""
            }`}
          />
        )}

        {/* Live Preview Pane */}
        {(view === "preview" || view === "split") && (
          <div className="p-6 bg-card/40 overflow-y-auto max-h-[500px] prose prose-stone dark:prose-invert max-w-none w-full">
            {value.trim() === "" ? (
              <p className="text-sm text-muted-foreground/60 italic font-medium">Nothing to preview yet...</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node: _, ...props }) => <h1 className="text-2xl font-bold text-foreground mt-4 mb-3 border-b border-border/40 pb-1" {...props} />,
                  h2: ({ node: _, ...props }) => <h2 className="text-xl font-semibold text-foreground mt-4 mb-2.5 pb-0.5 border-b border-border/20" {...props} />,
                  h3: ({ node: _, ...props }) => <h3 className="text-lg font-semibold text-foreground mt-3 mb-2" {...props} />,
                  p: ({ node: _, ...props }) => <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4" {...props} />,
                  ul: ({ node: _, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-muted-foreground text-sm sm:text-base" {...props} />,
                  ol: ({ node: _, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-muted-foreground text-sm sm:text-base" {...props} />,
                  li: ({ node: _, ...props }) => <li className="marker:text-primary" {...props} />,
                  a: ({ node: _, ...props }) => <a className="text-primary hover:text-accent underline underline-offset-4 font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                  blockquote: ({ node: _, ...props }) => <blockquote className="border-l-4 border-primary/40 pl-4 py-2 italic my-4 bg-muted/30 rounded-r-lg text-muted-foreground" {...props} />,
                  code: ({ node: _, inline, className, children, ...props }: { node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <div className="relative my-4 overflow-hidden rounded-xl border border-border/50 bg-neutral-900 dark:bg-black/40 text-neutral-200">
                        {match && (
                          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-1.5 font-mono text-[10px] text-neutral-400">
                            <span>{match[1]}</span>
                          </div>
                        )}
                        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                          <code {...props} className={className}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-medium" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table: ({ node: _, ...props }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-border/40">
                      <table className="w-full text-left border-collapse text-sm" {...props} />
                    </div>
                  ),
                  thead: ({ node: _, ...props }) => <thead className="bg-muted text-foreground font-semibold border-b border-border/40" {...props} />,
                  tbody: ({ node: _, ...props }) => <tbody className="divide-y divide-border/20" {...props} />,
                  tr: ({ node: _, ...props }) => <tr className="hover:bg-muted/10 transition-colors" {...props} />,
                  th: ({ node: _, ...props }) => <th className="px-4 py-3 border-r border-border/20 last:border-r-0" {...props} />,
                  td: ({ node: _, ...props }) => <td className="px-4 py-3 text-muted-foreground border-r border-border/20 last:border-r-0" {...props} />,
                }}
              >
                {value}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
