import type { BlockContentProps } from '../types';

export function ImageBlock({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="space-y-2 py-2">
      {content ? (
        <div className="overflow-hidden rounded-xl border border-border/30 shadow-sm">
          <img src={content} alt="Block image" className="max-w-full" />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-border/40 bg-muted/10 py-12 text-center transition-colors hover:border-border/60 hover:bg-muted/20">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="mx-auto mb-3 text-muted-foreground/30"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground/40">Add an image URL below</p>
        </div>
      )}
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Paste image URL..."
        className="w-full rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/25 focus:border-primary/40 focus:bg-muted/30"
      />
    </div>
  );
}
