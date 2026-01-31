'use client';

import { useState, useRef, useEffect } from 'react';
import type { Block } from '@/types';

interface BlockEditorProps {
  block: Block;
  onUpdate: (blockId: string, content: string, properties?: Record<string, unknown>) => void;
  onDelete: (blockId: string) => void;
  onNewBlock: (afterBlockId: string) => void;
  onChangeType?: (blockId: string, newType: Block['type']) => void;
}

export function BlockEditor({ block, onUpdate, onDelete, onNewBlock, onChangeType }: BlockEditorProps) {
  const [content, setContent] = useState(block.content);
  const [isChecked, setIsChecked] = useState(block.properties?.checked === true);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setContent(block.content);
    setIsChecked(block.properties?.checked === true);
  }, [block]);

  // Auto-focus when block type changes or when a new block is created
  useEffect(() => {
    if (inputRef.current && !block.content) {
      inputRef.current.focus();
    }
  }, [block.type, block.id]);

  const handleContentChange = (value: string) => {
    // Check if user typed "/" at the start of an empty TEXT block
    if (value === '/' && block.type === 'TEXT' && content === '') {
      setShowCommandMenu(true);
      setSelectedCommandIndex(0); // Reset selection
      setContent('/');
      return; // Don't call onUpdate for just "/"
    }

    // If menu is open and user continues typing
    if (showCommandMenu && value.length > 1) {
      setShowCommandMenu(false);
      // Remove the "/" prefix
      const cleanValue = value.startsWith('/') ? value.slice(1) : value;
      setContent(cleanValue);
      onUpdate(block.id, cleanValue);
      return;
    }

    // If user deletes back to empty while menu is open
    if (showCommandMenu && value === '') {
      setShowCommandMenu(false);
      setContent('');
      onUpdate(block.id, '');
      return;
    }

    setContent(value);
    onUpdate(block.id, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle arrow keys when menu is open
    if (showCommandMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex((prev) =>
          prev < commandOptions.length - 1 ? prev + 1 : prev
        );
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }
    }

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (showCommandMenu) {
        // Select the highlighted command
        const selectedCommand = commandOptions[selectedCommandIndex];
        handleSelectCommand(selectedCommand.type);
      } else {
        // Create new block below current one
        onNewBlock(block.id);
      }
      return;
    }

    // Handle Backspace on empty block
    if (e.key === 'Backspace' && (content === '' || content === '/')) {
      e.preventDefault();

      if (showCommandMenu) {
        setShowCommandMenu(false);
        setContent('');
        onUpdate(block.id, '');
      } else {
        onDelete(block.id);
      }
      return;
    }

    // Handle Escape to close menu
    if (e.key === 'Escape' && showCommandMenu) {
      e.preventDefault();
      setShowCommandMenu(false);
      setContent('');
      onUpdate(block.id, '');
      return;
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

  const commandOptions = [
    { label: 'Heading 1', type: 'HEADING_1' as const, icon: 'H1' },
    { label: 'Heading 2', type: 'HEADING_2' as const, icon: 'H2' },
    { label: 'Heading 3', type: 'HEADING_3' as const, icon: 'H3' },
    { label: 'Text', type: 'TEXT' as const, icon: 'T' },
    { label: 'Todo', type: 'TODO' as const, icon: '☐' },
    { label: 'Bulleted List', type: 'BULLETED_LIST' as const, icon: '•' },
    { label: 'Numbered List', type: 'NUMBERED_LIST' as const, icon: '1.' },
    { label: 'Code', type: 'CODE' as const, icon: '</>' },
    { label: 'Quote', type: 'QUOTE' as const, icon: '"' },
    { label: 'Divider', type: 'DIVIDER' as const, icon: '—' },
    { label: 'Callout', type: 'CALLOUT' as const, icon: '💡' },
  ];

  const handleSelectCommand = (type: Block['type']) => {
    if (onChangeType) {
      setShowCommandMenu(false);
      setContent('');
      onChangeType(block.id, type);
      // Focus will happen automatically via useEffect after type changes
    }
  };

  return (
    <div className="group relative py-0.5">
      {renderBlock()}

      {showCommandMenu && (
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 w-64 max-h-64 overflow-auto notion-scrollbar">
          <div className="p-1">
            {commandOptions.map((option, index) => (
              <button
                key={option.type}
                onClick={() => handleSelectCommand(option.type)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                  index === selectedCommandIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                <span className="text-muted-foreground w-6">{option.icon}</span>
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
