import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { CALLOUT_COLORS, CALLOUT_ICONS } from '../constants';
import { useClickOutside } from '../useClickOutside';
import type { BlockContentProps } from '../types';

export function CalloutBlock({ block, content, onChange, onKeyDown, onUpdate, inputRef }: BlockContentProps) {
  const [calloutIcon, setCalloutIcon] = useState(block.icon || '💡');
  const [calloutColor, setCalloutColor] = useState(block.color || 'default');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setShowMenu(false), showMenu);

  const colorConfig = CALLOUT_COLORS.find((c) => c.value === calloutColor) || CALLOUT_COLORS[0];

  const handleIconChange = useCallback(
    (icon: string) => {
      setCalloutIcon(icon);
      onUpdate(block.id, content, { icon, color: calloutColor });
    },
    [block.id, content, calloutColor, onUpdate],
  );

  const handleColorChange = useCallback(
    (colorValue: string) => {
      setCalloutColor(colorValue);
      setShowMenu(false);
      onUpdate(block.id, content, { icon: calloutIcon, color: colorValue });
    },
    [block.id, content, calloutIcon, onUpdate],
  );

  return (
    <div className={cn('relative my-2 rounded-xl border p-4', colorConfig.border, colorConfig.bg)}>
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="rounded-lg p-1.5 text-2xl leading-none transition-colors hover:bg-background/50"
            title="Change icon"
          >
            {calloutIcon}
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-full left-0 z-50 mt-1 w-64 rounded-xl border border-border bg-popover p-3 shadow-xl"
            >
              <div className="mb-3">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Icon</div>
                <div className="flex flex-wrap gap-1">
                  {CALLOUT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => handleIconChange(icon)}
                      className={cn(
                        'rounded-lg p-1.5 text-lg transition-colors hover:bg-accent',
                        calloutIcon === icon && 'bg-accent ring-2 ring-primary/30',
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Color</div>
                <div className="flex flex-wrap gap-1.5">
                  {CALLOUT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                        color.bg,
                        color.border,
                        calloutColor === color.value
                          ? 'scale-105 ring-2 ring-primary/40'
                          : 'hover:scale-105',
                      )}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type something..."
          className={cn(
            'mt-1 flex-1 resize-none border-none bg-transparent leading-relaxed outline-none placeholder:text-muted-foreground/20',
            colorConfig.text,
          )}
          rows={Math.max(1, content.split('\n').length)}
        />
      </div>
    </div>
  );
}
