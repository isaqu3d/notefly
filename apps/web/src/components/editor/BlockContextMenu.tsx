import type { Block } from '@/types';
import { cn } from '@/lib/utils';
import { COMMAND_OPTIONS } from './constants';

interface BlockContextMenuProps {
  blockType: Block['type'];
  onDelete: () => void;
  onDuplicate?: () => void;
  onChangeType?: (type: Block['type']) => void;
}

export function BlockContextMenu({ blockType, onDelete, onDuplicate, onChangeType }: BlockContextMenuProps) {
  return (
    <>
      <button
        onClick={onDelete}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
        Delete
      </button>

      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Duplicate
        </button>
      )}

      {onChangeType && (
        <>
          <div className="my-1 border-t border-border" />
          <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Turn into</div>
          {COMMAND_OPTIONS.slice(0, 8).map((option) => (
            <button
              key={option.type}
              onClick={() => onChangeType(option.type)}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                blockType === option.type && 'bg-accent/50 font-medium',
              )}
            >
              <span className="w-5 text-center text-xs text-muted-foreground">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </>
      )}
    </>
  );
}
