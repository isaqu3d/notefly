'use client';

import { useState, useRef, useEffect } from 'react';
import type { Block } from '@/types';

interface BlockEditorProps {
  block: Block;
  onUpdate: (blockId: string, content: string, properties?: Record<string, unknown>) => void;
  onDelete: (blockId: string) => void;
  onNewBlock: (afterBlockId: string) => void;
}

export function BlockEditor({ block, onUpdate, onDelete, onNewBlock }: BlockEditorProps) {
  const [content, setContent] = useState(block.content);
  const [isChecked, setIsChecked] = useState(block.properties?.checked === true);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setContent(block.content);
    setIsChecked(block.properties?.checked === true);
  }, [block]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdate(block.id, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onNewBlock(block.id);
    }

    if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    onUpdate(block.id, content, { checked });
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'HEADING_1':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Heading 1"
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 py-1"
          />
        );

      case 'HEADING_2':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Heading 2"
            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 py-1"
          />
        );

      case 'HEADING_3':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Heading 3"
            className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 py-1"
          />
        );

      case 'TODO':
        return (
          <div className="flex items-start gap-2 py-0.5">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border cursor-pointer"
            />
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
              className={`flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/30 ${
                isChecked ? 'line-through text-muted-foreground' : ''
              }`}
            />
          </div>
        );

      case 'BULLETED_LIST':
        return (
          <div className="flex items-start gap-2 py-0.5">
            <span className="mt-0.5 text-muted-foreground">•</span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="List"
              className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/30"
            />
          </div>
        );

      case 'NUMBERED_LIST':
        return (
          <div className="flex items-start gap-2 py-0.5">
            <span className="mt-0.5 text-muted-foreground text-sm">{block.position + 1}.</span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="List"
              className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/30"
            />
          </div>
        );

      case 'CODE':
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Code"
            className="w-full p-3 bg-muted/50 rounded font-mono text-sm border-none outline-none resize-none placeholder:text-muted-foreground/30"
            rows={4}
          />
        );

      case 'QUOTE':
        return (
          <div className="border-l-3 border-border pl-4 py-0.5">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Quote"
              className="w-full italic bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30"
              rows={2}
            />
          </div>
        );

      case 'CALLOUT':
        return (
          <div className="p-3 bg-accent/50 rounded border border-border">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Callout"
              className="w-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30"
              rows={2}
            />
          </div>
        );

      case 'DIVIDER':
        return <hr className="my-3 border-border" />;

      case 'IMAGE':
        return (
          <div className="space-y-2 py-1">
            {content ? (
              <img src={content} alt="Block image" className="max-w-full rounded" />
            ) : (
              <div className="p-8 border-2 border-dashed border-border rounded text-center">
                <p className="text-muted-foreground text-sm">Image URL</p>
              </div>
            )}
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 bg-transparent border border-border rounded outline-none text-sm placeholder:text-muted-foreground/30"
            />
          </div>
        );

      default:
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something or type '/' for commands..."
            className="w-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 py-0.5"
            rows={1}
            style={{ minHeight: '24px' }}
          />
        );
    }
  };

  return (
    <div className="group relative py-0.5">
      {renderBlock()}
      <button
        onClick={() => onDelete(block.id)}
        className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive text-lg"
        title="Delete block"
      >
        ×
      </button>
    </div>
  );
}
