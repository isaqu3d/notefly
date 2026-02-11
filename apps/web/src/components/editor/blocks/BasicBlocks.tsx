import type { BlockContentProps } from '../types';

const INPUT_BASE = 'w-full border-none bg-transparent outline-none placeholder:text-muted-foreground/20';

export function Heading1Block({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="pb-2 pt-8">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Heading 1"
        className={`${INPUT_BASE} text-[2.25rem] font-extrabold leading-tight tracking-tight`}
      />
      <div className="mt-2 h-px bg-border/50" />
    </div>
  );
}

export function Heading2Block({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="pb-1 pt-6">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Heading 2"
        className={`${INPUT_BASE} text-[1.75rem] font-bold leading-snug tracking-tight`}
      />
    </div>
  );
}

export function Heading3Block({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="pb-0.5 pt-4">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Heading 3"
        className={`${INPUT_BASE} text-[1.35rem] font-semibold leading-snug`}
      />
    </div>
  );
}

export function TextBlock({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <textarea
      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Type something or type '/' for commands..."
      className="w-full resize-none border-none bg-transparent py-0.5 leading-relaxed outline-none placeholder:text-muted-foreground/20"
      rows={1}
      style={{ minHeight: '24px' }}
    />
  );
}

export function BulletListBlock({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="flex items-start gap-3 py-0.5 pl-2">
      <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-foreground/70" />
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="List item"
        className="flex-1 border-none bg-transparent leading-relaxed outline-none placeholder:text-muted-foreground/20"
      />
    </div>
  );
}

export function NumberedListBlock({ block, content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="flex items-start gap-3 py-0.5 pl-1">
      <span className="mt-[2px] min-w-[24px] shrink-0 select-none text-right font-semibold tabular-nums text-foreground/50">
        {block.position + 1}.
      </span>
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="List item"
        className="flex-1 border-none bg-transparent leading-relaxed outline-none placeholder:text-muted-foreground/20"
      />
    </div>
  );
}

export function QuoteBlock({ content, onChange, onKeyDown, inputRef }: BlockContentProps) {
  return (
    <div className="my-2 flex">
      <div className="mr-4 w-[3px] shrink-0 rounded-full bg-foreground/30" />
      <div className="flex-1 py-1 pl-1">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Write a quote..."
          className="w-full resize-none border-none bg-transparent text-[1.05rem] italic leading-relaxed text-foreground/70 outline-none placeholder:text-muted-foreground/20"
          rows={Math.max(1, content.split('\n').length)}
        />
      </div>
    </div>
  );
}

export function DividerBlock() {
  return (
    <div className="py-4">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
