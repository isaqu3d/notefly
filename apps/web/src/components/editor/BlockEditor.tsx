'use client';

import type { Block } from '@/types';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COMMAND_OPTIONS } from './constants';
import { useClickOutside } from './useClickOutside';
import { DragHandle } from './DragHandle';
import { CommandMenu } from './CommandMenu';
import { BlockContextMenu } from './BlockContextMenu';
import {
  Heading1Block,
  Heading2Block,
  Heading3Block,
  TextBlock,
  BulletListBlock,
  NumberedListBlock,
  QuoteBlock,
  DividerBlock,
  CodeBlock,
  CalloutBlock,
  TodoBlock,
  ImageBlock,
} from './blocks';

interface BlockEditorProps {
  block: Block;
  onUpdate: (blockId: string, content: string, properties?: Record<string, unknown>) => void;
  onDelete: (blockId: string) => void;
  onNewBlock: (afterBlockId: string) => void;
  onChangeType?: (blockId: string, newType: Block['type']) => void;
  onDuplicate?: (blockId: string) => void;
  onReorder?: (draggedBlockId: string, targetBlockId: string) => void;
  isDragging?: boolean;
  onDragStart?: (blockId: string) => void;
  onDragEnd?: () => void;
}

const BLOCK_COMPONENTS: Record<string, React.ComponentType<BlockContentProps>> = {
  HEADING_1: Heading1Block,
  HEADING_2: Heading2Block,
  HEADING_3: Heading3Block,
  TODO: TodoBlock,
  BULLET_LIST: BulletListBlock,
  NUMBERED_LIST: NumberedListBlock,
  CODE: CodeBlock,
  QUOTE: QuoteBlock,
  CALLOUT: CalloutBlock,
  IMAGE: ImageBlock,
};

type BlockContentProps = Parameters<typeof TextBlock>[0];

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onNewBlock,
  onChangeType,
  onDuplicate,
  onReorder,
  isDragging,
  onDragStart,
  onDragEnd,
}: BlockEditorProps) {
  const [content, setContent] = useState(block.content);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(block.content);
  }, [block]);

  useEffect(() => {
    if (inputRef.current && !block.content) {
      inputRef.current.focus();
    }
  }, [block.type, block.id, block.content]);

  useEffect(() => {
    if (showCommandMenu && menuItemRefs.current[selectedCommandIndex]) {
      menuItemRefs.current[selectedCommandIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedCommandIndex, showCommandMenu]);

  useClickOutside(contextMenuRef, () => setShowContextMenu(false), showContextMenu);

  const handleContentChange = useCallback(
    (value: string) => {
      if (value === '/' && block.type === 'TEXT' && content === '') {
        setShowCommandMenu(true);
        setSelectedCommandIndex(0);
        setContent('/');
        return;
      }

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
    },
    [block.id, block.type, content, showCommandMenu, onUpdate],
  );

  const handleSelectCommand = useCallback(
    (type: Block['type']) => {
      if (onChangeType) {
        setShowCommandMenu(false);
        setContent('');
        onChangeType(block.id, type);
      }
    },
    [block.id, onChangeType],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (showCommandMenu) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedCommandIndex((prev) => Math.min(prev + 1, COMMAND_OPTIONS.length - 1));
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedCommandIndex((prev) => Math.max(prev - 1, 0));
          return;
        }
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (showCommandMenu) {
          handleSelectCommand(COMMAND_OPTIONS[selectedCommandIndex].type);
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

      if (e.key === 'Escape' && showCommandMenu) {
        e.preventDefault();
        setShowCommandMenu(false);
        setContent('');
        onUpdate(block.id, '');
      }
    },
    [block.id, content, showCommandMenu, selectedCommandIndex, handleSelectCommand, onNewBlock, onDelete, onUpdate],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', block.id);
      e.dataTransfer.effectAllowed = 'move';
      onDragStart?.(block.id);
    },
    [block.id, onDragStart],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const draggedBlockId = e.dataTransfer.getData('text/plain');
      if (draggedBlockId && draggedBlockId !== block.id) {
        onReorder?.(draggedBlockId, block.id);
      }
    },
    [block.id, onReorder],
  );

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleToggleMenu = useCallback(() => setShowContextMenu((prev) => !prev), []);
  const handleDragEnd = useCallback(() => onDragEnd?.(), [onDragEnd]);

  const blockContentProps = {
    block,
    content,
    onChange: handleContentChange,
    onKeyDown: handleKeyDown,
    onUpdate,
    inputRef,
  };

  const BlockComponent = block.type === 'DIVIDER' ? null : (BLOCK_COMPONENTS[block.type] ?? TextBlock);

  return (
    <div
      ref={blockRef}
      className={cn(
        'group relative py-0.5 flex items-start gap-1 transition-all',
        isDragging && 'opacity-50',
        isDragOver && 'border-t-2 border-primary pt-1',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DragHandle
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onToggleMenu={handleToggleMenu}
      />

      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute left-0 top-6 z-50 w-52 rounded-xl border border-border bg-popover py-1 shadow-xl"
        >
          <BlockContextMenu
            blockType={block.type}
            onDelete={() => {
              setShowContextMenu(false);
              onDelete(block.id);
            }}
            onDuplicate={
              onDuplicate
                ? () => {
                    setShowContextMenu(false);
                    onDuplicate(block.id);
                  }
                : undefined
            }
            onChangeType={
              onChangeType
                ? (type) => {
                    setShowContextMenu(false);
                    onChangeType(block.id, type);
                  }
                : undefined
            }
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        {BlockComponent ? <BlockComponent {...blockContentProps} /> : <DividerBlock />}
      </div>

      {showCommandMenu && (
        <CommandMenu
          selectedIndex={selectedCommandIndex}
          onSelect={handleSelectCommand}
          menuItemRefs={menuItemRefs}
        />
      )}
    </div>
  );
}
