import type { Block } from '@/types';
import { cn } from '@/lib/utils';
import { COMMAND_OPTIONS } from './constants';

interface CommandMenuProps {
  selectedIndex: number;
  onSelect: (type: Block['type']) => void;
  menuItemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export function CommandMenu({ selectedIndex, onSelect, menuItemRefs }: CommandMenuProps) {
  return (
    <div className="absolute top-full left-0 z-50 mt-1 w-72 max-h-72 overflow-auto rounded-xl border border-border bg-popover shadow-xl notion-scrollbar">
      <div className="border-b border-border px-2 py-1.5 text-xs font-medium text-muted-foreground">
        Basic blocks
      </div>
      <div className="p-1">
        {COMMAND_OPTIONS.map((option, index) => (
          <button
            key={option.type}
            ref={(el) => {
              menuItemRefs.current[index] = el;
            }}
            onClick={() => onSelect(option.type)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
              index === selectedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50',
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
              {option.icon}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
