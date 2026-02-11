import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import type { BlockContentProps } from '../types';

export function TodoBlock({ block, content, onChange, onKeyDown, onUpdate, inputRef }: BlockContentProps) {
  const [isChecked, setIsChecked] = useState(block.checked === true);

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      setIsChecked(checked);
      onUpdate(block.id, content, { checked });
    },
    [block.id, content, onUpdate],
  );

  return (
    <div className="group/todo flex items-start gap-3 py-1.5">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="peer sr-only"
          id={`todo-${block.id}`}
        />
        <label
          htmlFor={`todo-${block.id}`}
          className={cn(
            'flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[5px] border-2 transition-all duration-200',
            isChecked
              ? 'border-blue-500 bg-blue-500 shadow-sm shadow-blue-500/25'
              : 'border-muted-foreground/30 hover:border-blue-400 hover:bg-blue-500/5',
          )}
        >
          {isChecked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </label>
      </div>
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="To-do"
        className={cn(
          'flex-1 border-none bg-transparent outline-none transition-all duration-200 placeholder:text-muted-foreground/20',
          isChecked && 'text-muted-foreground/50 line-through decoration-muted-foreground/30',
        )}
      />
    </div>
  );
}
