import { useCallback, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import cssLang from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import jsonLang from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { CODE_LANGUAGES, SYNTAX_THEME_CSS } from '../constants';
import { useClickOutside } from '../useClickOutside';
import type { BlockContentProps } from '../types';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', cssLang);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', jsonLang);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('bash', bash);

const EMPTY_PLACEHOLDER = '<span style="color:#5c6370;font-style:italic">// Write your code here...</span>\n';

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function CodeBlock({ block, content, onChange, onKeyDown, onUpdate, inputRef }: BlockContentProps) {
  const [codeLanguage, setCodeLanguage] = useState(block.language || 'plaintext');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(languageMenuRef, () => setShowLanguageMenu(false), showLanguageMenu);

  const highlightedCode = useMemo(() => {
    if (!content) return EMPTY_PLACEHOLDER;
    if (codeLanguage !== 'plaintext' && hljs.getLanguage(codeLanguage)) {
      return hljs.highlight(content, { language: codeLanguage }).value + '\n';
    }
    return escapeHtml(content) + '\n';
  }, [content, codeLanguage]);

  const lineNumbers = useMemo(
    () => (content ? content.split('\n') : ['']).map((_, i) => i + 1),
    [content],
  );

  const currentLanguageLabel = useMemo(
    () => CODE_LANGUAGES.find((l) => l.value === codeLanguage)?.label || 'Plain Text',
    [codeLanguage],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [content]);

  const handleLanguageSelect = useCallback(
    (langValue: string) => {
      setCodeLanguage(langValue);
      setShowLanguageMenu(false);
      onUpdate(block.id, content, { language: langValue });
    },
    [block.id, content, onUpdate],
  );

  const handleCodeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const newValue = content.substring(0, start) + '  ' + content.substring(end);
        onChange(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        }, 0);
        return;
      }
      if (e.key === 'Enter') {
        e.stopPropagation();
        return;
      }
      onKeyDown(e);
    },
    [content, onChange, onKeyDown],
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SYNTAX_THEME_CSS }} />
      <div className="relative my-2 overflow-hidden rounded-xl border border-[#30363d] bg-[#1e1e2e] shadow-lg shadow-black/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#181825] px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* Window dots */}
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]/80" />
            </div>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium text-[#cdd6f4]/70 transition-colors hover:bg-white/5 hover:text-[#cdd6f4]"
              >
                {currentLanguageLabel}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showLanguageMenu && (
                <div
                  ref={languageMenuRef}
                  className="absolute top-full left-0 z-50 mt-1 max-h-52 w-44 overflow-auto rounded-lg border border-[#30363d] bg-[#1e1e2e] shadow-2xl shadow-black/40 notion-scrollbar"
                >
                  {CODE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => handleLanguageSelect(lang.value)}
                      className={cn(
                        'w-full px-3 py-2 text-left font-mono text-xs transition-colors first:rounded-t-lg last:rounded-b-lg',
                        codeLanguage === lang.value
                          ? 'bg-[#313244] font-medium text-[#cdd6f4]'
                          : 'text-[#a6adc8] hover:bg-[#313244]/50 hover:text-[#cdd6f4]',
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-all duration-200',
              isCopied
                ? 'bg-emerald-400/10 text-emerald-400'
                : 'text-[#a6adc8] hover:bg-white/5 hover:text-[#cdd6f4]',
            )}
            title="Copy code"
          >
            {isCopied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code area */}
        <div className="code-highlight relative flex">
          {/* Line numbers */}
          <div className="pointer-events-none shrink-0 select-none py-4 pl-4 pr-2">
            {lineNumbers.map((num) => (
              <div key={num} className="min-w-[2ch] text-right font-mono text-[13px] leading-6 text-[#45475a]">
                {num}
              </div>
            ))}
          </div>

          {/* Code content */}
          <div className="relative flex-1 overflow-hidden">
            <pre
              className="pointer-events-none overflow-auto whitespace-pre-wrap break-words py-4 pr-4 font-mono text-[13px] leading-6"
              aria-hidden="true"
            >
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleCodeKeyDown}
              className="absolute inset-0 h-full w-full resize-none whitespace-pre-wrap break-words border-none bg-transparent py-4 pr-4 font-mono text-[13px] leading-6 text-transparent caret-[#cdd6f4] outline-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
