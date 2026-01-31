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
            className="w-full text-4xl font-bold bg-transparent border-none outline-none"
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
            className="w-full text-3xl font-bold bg-transparent border-none outline-none"
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
            className="w-full text-2xl font-bold bg-transparent border-none outline-none"
          />
        );

      case 'TODO':
        return (
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
              className={`flex-1 bg-transparent border-none outline-none ${
                isChecked ? 'line-through text-gray-500' : ''
              }`}
            />
          </div>
        );

      case 'BULLETED_LIST':
        return (
          <div className="flex items-start gap-3">
            <span className="mt-1">•</span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="List"
              className="flex-1 bg-transparent border-none outline-none"
            />
          </div>
        );

      case 'NUMBERED_LIST':
        return (
          <div className="flex items-start gap-3">
            <span className="mt-1">{block.position + 1}.</span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="List"
              className="flex-1 bg-transparent border-none outline-none"
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
            className="w-full p-4 bg-gray-100 dark:bg-gray-900 rounded font-mono text-sm border-none outline-none resize-none"
            rows={4}
          />
        );

      case 'QUOTE':
        return (
          <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Quote"
              className="w-full italic bg-transparent border-none outline-none resize-none"
              rows={2}
            />
          </div>
        );

      case 'CALLOUT':
        return (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Callout"
              className="w-full bg-transparent border-none outline-none resize-none"
              rows={2}
            />
          </div>
        );

      case 'DIVIDER':
        return <hr className="my-4 border-gray-300 dark:border-gray-700" />;

      case 'IMAGE':
        return (
          <div className="space-y-2">
            {content ? (
              <img src={content} alt="Block image" className="max-w-full rounded-lg" />
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-gray-500">Image URL</p>
              </div>
            )}
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded outline-none"
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
            placeholder="Type something..."
            className="w-full bg-transparent border-none outline-none resize-none"
            rows={1}
            style={{ minHeight: '24px' }}
          />
        );
    }
  };

  return (
    <div className="group relative py-1">
      {renderBlock()}
      <button
        onClick={() => onDelete(block.id)}
        className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
        title="Delete block"
      >
        ×
      </button>
    </div>
  );
}
