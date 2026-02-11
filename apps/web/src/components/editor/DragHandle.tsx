import { memo } from 'react';

interface DragHandleProps {
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleMenu: () => void;
}

export const DragHandle = memo(function DragHandle({ onDragStart, onDragEnd, onToggleMenu }: DragHandleProps) {
  return (
    <div className="-ml-14 flex items-center pt-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onToggleMenu}
        className="cursor-grab rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
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
        onClick={onToggleMenu}
        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        title="Click for options"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="7" cy="2" r="1.5" />
          <circle cx="7" cy="7" r="1.5" />
          <circle cx="7" cy="12" r="1.5" />
        </svg>
      </button>
    </div>
  );
});
