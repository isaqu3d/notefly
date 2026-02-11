import type { CommandOption } from './types';

export const SYNTAX_THEME_CSS = `
.code-highlight .hljs { color: #abb2bf; }
.code-highlight .hljs-keyword { color: #c678dd; font-weight: 500; }
.code-highlight .hljs-built_in { color: #e6c07b; }
.code-highlight .hljs-type { color: #e6c07b; }
.code-highlight .hljs-literal { color: #d19a66; }
.code-highlight .hljs-number { color: #d19a66; }
.code-highlight .hljs-string { color: #98c379; }
.code-highlight .hljs-regexp { color: #98c379; }
.code-highlight .hljs-comment { color: #5c6370; font-style: italic; }
.code-highlight .hljs-doctag { color: #c678dd; }
.code-highlight .hljs-function { color: #61afef; }
.code-highlight .hljs-title { color: #61afef; }
.code-highlight .hljs-title\\.class_ { color: #e6c07b; }
.code-highlight .hljs-title\\.function_ { color: #61afef; }
.code-highlight .hljs-variable { color: #e06c75; }
.code-highlight .hljs-variable\\.language_ { color: #e06c75; font-style: italic; }
.code-highlight .hljs-params { color: #abb2bf; }
.code-highlight .hljs-attr { color: #d19a66; }
.code-highlight .hljs-attribute { color: #98c379; }
.code-highlight .hljs-meta { color: #61afef; }
.code-highlight .hljs-meta .hljs-keyword { color: #c678dd; }
.code-highlight .hljs-meta .hljs-string { color: #98c379; }
.code-highlight .hljs-tag { color: #abb2bf; }
.code-highlight .hljs-name { color: #e06c75; }
.code-highlight .hljs-selector-tag { color: #e06c75; }
.code-highlight .hljs-selector-class { color: #e6c07b; }
.code-highlight .hljs-selector-id { color: #61afef; }
.code-highlight .hljs-selector-attr { color: #d19a66; }
.code-highlight .hljs-selector-pseudo { color: #c678dd; }
.code-highlight .hljs-property { color: #e06c75; }
.code-highlight .hljs-symbol { color: #56b6c2; }
.code-highlight .hljs-bullet { color: #d19a66; }
.code-highlight .hljs-addition { color: #98c379; background-color: rgba(152,195,121,0.1); }
.code-highlight .hljs-deletion { color: #e06c75; background-color: rgba(224,108,117,0.1); }
.code-highlight .hljs-operator { color: #56b6c2; }
.code-highlight .hljs-punctuation { color: #abb2bf; }
.code-highlight .hljs-subst { color: #e06c75; }
.code-highlight .hljs-section { color: #61afef; font-weight: bold; }
.code-highlight .hljs-emphasis { font-style: italic; }
.code-highlight .hljs-strong { font-weight: bold; }
.code-highlight .hljs-link { color: #61afef; text-decoration: underline; }
`;

export const CALLOUT_ICONS = [
  '💡', '📝', '⚠️', '❗', '✅', '❌', '📌', '🔥', '💬', '🎯',
  '📎', '🚀', '💻', '📊', '🔗',
];

export const CALLOUT_COLORS = [
  { value: 'default', label: 'Default', bg: 'bg-accent/50', border: 'border-accent', text: 'text-foreground' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-900 dark:text-blue-100' },
  { value: 'green', label: 'Green', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-900 dark:text-emerald-100' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-900 dark:text-amber-100' },
  { value: 'red', label: 'Red', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-900 dark:text-red-100' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-900 dark:text-purple-100' },
];

export const CODE_LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
];

export const COMMAND_OPTIONS: CommandOption[] = [
  { label: 'Heading 1', description: 'Large section heading', type: 'HEADING_1', icon: 'H1' },
  { label: 'Heading 2', description: 'Medium section heading', type: 'HEADING_2', icon: 'H2' },
  { label: 'Heading 3', description: 'Small section heading', type: 'HEADING_3', icon: 'H3' },
  { label: 'Text', description: 'Plain text block', type: 'TEXT', icon: 'T' },
  { label: 'To-do', description: 'Checkbox item', type: 'TODO', icon: '☐' },
  { label: 'Bulleted List', description: 'Unordered list item', type: 'BULLET_LIST', icon: '•' },
  { label: 'Numbered List', description: 'Ordered list item', type: 'NUMBERED_LIST', icon: '1.' },
  { label: 'Code', description: 'Code snippet', type: 'CODE', icon: '</>' },
  { label: 'Quote', description: 'Quotation block', type: 'QUOTE', icon: '"' },
  { label: 'Divider', description: 'Horizontal divider', type: 'DIVIDER', icon: '—' },
  { label: 'Callout', description: 'Highlighted block', type: 'CALLOUT', icon: '💡' },
];
