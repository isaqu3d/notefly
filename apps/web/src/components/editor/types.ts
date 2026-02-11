import type { Block } from '@/types';

export interface BlockContentProps {
  block: Block;
  content: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onUpdate: (
    blockId: string,
    content: string,
    properties?: Record<string, unknown>
  ) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
}

export interface CommandOption {
  label: string;
  description: string;
  type: Block['type'];
  icon: string;
}
