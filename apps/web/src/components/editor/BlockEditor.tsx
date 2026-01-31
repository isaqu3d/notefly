'use client';

import type { Block } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface BlockEditorProps {
  block: Block;
  onUpdate: (
    blockId: string,
    content: string,
    properties?: Record<string, unknown>
  ) => void;
  onDelete: (blockId: string) => void;
  onNewBlock: (afterBlockId: string) => void;
  onChangeType?: (blockId: string, newType: Block['type']) => void;
  onDuplicate?: (blockId: string) => void;
}

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onNewBlock,
  onChangeType,
  onDuplicate,
}: BlockEditorProps) {
  const [content, setContent] = useState(block.content);
  const [isChecked, setIsChecked] = useState(
    block.properties?.checked === true
  );
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll menu item into view when navigating with keyboard
  useEffect(() => {
    if (showCommandMenu && menuItemRefs.current[selectedCommandIndex]) {
      menuItemRefs.current[selectedCommandIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedCommandIndex, showCommandMenu]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  const handleContentChange = (value: string) => {
    // Check if user typed "/" at the start of an empty TEXT block
    if (value === '/' && block.type === 'TEXT' && content === '') {
      setShowCommandMenu(true);
      setSelectedCommandIndex(0); // Reset selection
      setContent('/');
      return;
    }

    // If menu is open and user continues typing
    if (showCommandMenu && value.length > 1) {
      setShowCommandMenu(false);
      const cleanValue = value.startsWith('/') ? value.slice(1) : value;
      setContent(cleanValue);
      onUpdate(block.id, cleanValue);
      return;
    }

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
        const selectedCommand = commandOptions[selectedCommandIndex];
        handleSelectCommand(selectedCommand.type);
      } else {
        onNewBlock(block.id);
      }
      return;
    }

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
            <span className="mt-0.5 text-muted-foreground text-sm">
              {block.position + 1}.
            </span>
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
              <img
                src={content}
                alt="Block image"
                className="max-w-full rounded"
              />
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
    }
  };

  const handleDeleteBlock = () => {
    setShowContextMenu(false);
    onDelete(block.id);
  };

  const handleDuplicateBlock = () => {
    setShowContextMenu(false);
    if (onDuplicate) {
      onDuplicate(block.id);
    }
  };

  return (
    <div className="group relative py-0.5 flex items-start gap-1">
      {/* Drag handle and context menu trigger */}
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity -ml-14 pt-0.5">
        <button
          onClick={() => setShowContextMenu(!showContextMenu)}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
          title="Drag to move. Click for options."
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="4" cy="3" r="1.5" />
            <circle cx="10" cy="3" r="1.5" />
            <circle cx="4" cy="7" r="1.5" />
            <circle cx="10" cy="7" r="1.5" />
            <circle cx="4" cy="11" r="1.5" />
            <circle cx="10" cy="11" r="1.5" />
          </svg>
        </button>
        <button
          onClick={() => setShowContextMenu(!showContextMenu)}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
          title="Click for options"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="2" r="1.5" />
            <circle cx="7" cy="7" r="1.5" />
            <circle cx="7" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute left-0 top-6 bg-popover border border-border rounded-lg shadow-lg z-50 w-48 py-1"
        >
          <button
            onClick={handleDeleteBlock}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Delete
          </button>
          {onDuplicate && (
            <button
              onClick={handleDuplicateBlock}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Duplicate
            </button>
          )}
          {onChangeType && (
            <>
              <div className="border-t border-border my-1" />
              <div className="px-3 py-1 text-xs text-muted-foreground">
                Turn into
              </div>
              {commandOptions.slice(0, 6).map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    setShowContextMenu(false);
                    onChangeType(block.id, option.type);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-accent transition-colors"
                >
                  <span className="text-muted-foreground w-5 text-xs">
                    {option.icon}
                  </span>
                  {option.label}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Block content */}
      <div className="flex-1">{renderBlock()}</div>

      {/* Slash command menu */}
      {showCommandMenu && (
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 w-64 max-h-64 overflow-auto notion-scrollbar">
          <div className="p-1">
            {commandOptions.map((option, index) => (
              <button
                key={option.type}
                ref={(el) => (menuItemRefs.current[index] = el)}
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
