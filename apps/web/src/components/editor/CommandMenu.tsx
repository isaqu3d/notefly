import type { Block } from '@/types';
import { COMMAND_OPTIONS } from './constants';

interface CommandMenuProps {
  selectedIndex: number;
  onSelect: (type: Block['type']) => void;
  menuItemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export function CommandMenu({ selectedIndex, onSelect, menuItemRefs }: CommandMenuProps) {
  return (
    <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 w-72 max-h-72 overflow-auto notion-scrollbar">
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-border">
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
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              index === selectedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            }`}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground text-xs font-medium flex-shrink-0">
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
