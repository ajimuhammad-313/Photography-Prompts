import React, { useState } from 'react';
import {
  BookmarkPlus,
  Check,
  Copy,
  Download,
  FileCode2,
  FileText,
  Heart,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import {
  GeneratedPrompts,
  PhotographyConfig,
  PromptFormat,
  PromptLanguage,
} from '../types/photography';

interface PromptPreviewPanelProps {
  config: PhotographyConfig;
  prompts: GeneratedPrompts;
  language: PromptLanguage;
  format: PromptFormat;
  onChangeLanguage: (lang: PromptLanguage) => void;
  onChangeFormat: (fmt: PromptFormat) => void;
  onToggleEnhancer: () => void;
  onRandomize: () => void;
  onReset: () => void;
  onSaveFavorite: () => void;
  onSaveHistory: () => void;
  onDownloadTxt: () => void;
  onDownloadJson: () => void;
  onNotifyCopy: (label: string) => void;
  isFavorited: boolean;
}

export const PromptPreviewPanel: React.FC<PromptPreviewPanelProps> = ({
  config,
  prompts,
  language,
  format,
  onChangeLanguage,
  onChangeFormat,
  onToggleEnhancer,
  onRandomize,
  onReset,
  onSaveFavorite,
  onSaveHistory,
  onDownloadTxt,
  onDownloadJson,
  onNotifyCopy,
  isFavorited,
}) => {
  const [copiedTarget, setCopiedTarget] = useState<'main' | 'negative' | 'complete' | null>(null);
  const [historySaved, setHistorySaved] = useState(false);

  const mainOutput = format === 'structured' ? prompts.structured : prompts.naturalLanguage;

  const copyText = async (text: string, target: 'main' | 'negative' | 'complete', label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedTarget(target);
      onNotifyCopy(label);
      window.setTimeout(() => setCopiedTarget((prev) => (prev === target ? null : prev)), 1800);
    } catch {
      // Clipboard blocked in restricted frame; keep graceful fallback
    }
  };

  const handleSaveHistory = () => {
    onSaveHistory();
    setHistorySaved(true);
    window.setTimeout(() => setHistorySaved(false), 1800);
  };

  return (
    <section
      id="prompt-output-panel"
      aria-label="Live prompt preview"
      className="neo-card flex flex-col gap-3.5 p-4 sm:p-5 xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto"
      data-testid="prompt-preview-panel"
    >
      {/* Header & Language Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--studio-border-muted)] pb-3.5">
        <div>
          <h2 className="font-display text-base font-bold text-[var(--studio-ink)]">
            Prompt Output
          </h2>
          <p className="font-mono text-xs text-[var(--studio-ink-muted)] tabular-nums">
            {prompts.wordCount} words · {config.aspectRatio} · {config.aperture}
          </p>
        </div>

        <div
          role="group"
          aria-label="Prompt language"
          className="inline-flex rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-1"
        >
          <button
            type="button"
            onClick={() => onChangeLanguage('en')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              language === 'en'
                ? 'bg-[var(--studio-accent)] text-[#141518]'
                : 'text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onChangeLanguage('id')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              language === 'id'
                ? 'bg-[var(--studio-accent)] text-[#141518]'
                : 'text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
            }`}
          >
            Indonesian
          </button>
        </div>
      </div>

      {/* Format & Enhancer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label="Prompt output format"
          className="inline-flex rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-1"
        >
          <button
            type="button"
            onClick={() => onChangeFormat('natural')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              format === 'natural'
                ? 'bg-[var(--studio-surface)] text-[var(--studio-ink)] shadow-sm'
                : 'text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
            }`}
          >
            Natural Language
          </button>
          <button
            type="button"
            onClick={() => onChangeFormat('structured')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              format === 'structured'
                ? 'bg-[var(--studio-surface)] text-[var(--studio-ink)] shadow-sm'
                : 'text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
            }`}
          >
            Structured
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleEnhancer}
          aria-pressed={config.useEnhancer}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
            config.useEnhancer
              ? 'border-[var(--studio-accent)] bg-[var(--studio-accent-soft)] text-[var(--studio-ink)]'
              : 'border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] text-[var(--studio-ink-muted)]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--studio-accent)]" />
          <span>Enhancer {config.useEnhancer ? 'On' : 'Off'}</span>
        </button>
      </div>

      {/* Main Prompt Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--studio-ink-muted)]">
            {language === 'id' ? 'Prompt Utama' : 'Main Prompt'}
          </span>
          <button
            type="button"
            onClick={() => copyText(mainOutput, 'main', 'Main Prompt')}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--studio-accent)] hover:bg-[var(--studio-surface-alt)] whitespace-nowrap"
          >
            {copiedTarget === 'main' ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Main</span>
              </>
            )}
          </button>
        </div>

        <div
          data-testid="main-prompt-output"
          className={`max-h-44 overflow-y-auto rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-3 text-sm leading-relaxed text-[var(--studio-ink)] ${
            format === 'structured' ? 'whitespace-pre-line font-mono text-xs leading-5' : ''
          }`}
        >
          {mainOutput}
        </div>
      </div>

      {/* Negative Prompt Display */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--studio-ink-muted)]">
            {language === 'id' ? 'Prompt Negatif' : 'Negative Prompt'}
          </span>
          <button
            type="button"
            onClick={() => copyText(prompts.negativePrompt, 'negative', 'Negative Prompt')}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--studio-ink-muted)] hover:bg-[var(--studio-surface-alt)] hover:text-[var(--studio-ink)] whitespace-nowrap"
          >
            {copiedTarget === 'negative' ? (
              <>
                <Check className="h-3.5 w-3.5 text-[var(--studio-accent)]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Negative</span>
              </>
            )}
          </button>
        </div>

        <div
          data-testid="negative-prompt-output"
          className="max-h-24 overflow-y-auto rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-2.5 font-mono text-xs leading-relaxed text-[var(--studio-ink-muted)]"
        >
          {prompts.negativePrompt}
        </div>
      </div>

      {/* Primary Action Strip */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => copyText(prompts.completePrompt, 'complete', 'Complete Prompt')}
          className="neo-btn col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--studio-accent)] px-4 text-xs font-bold text-[#141518] whitespace-nowrap"
        >
          {copiedTarget === 'complete' ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied Complete Prompt</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Complete Prompt</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSaveFavorite}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-xs font-semibold text-[var(--studio-ink)] hover:border-[var(--studio-accent)] whitespace-nowrap transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${isFavorited ? 'fill-current text-[var(--studio-accent)]' : ''}`}
          />
          <span>{isFavorited ? 'Favorited' : 'Save Favorite'}</span>
        </button>

        <button
          type="button"
          onClick={handleSaveHistory}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-xs font-semibold text-[var(--studio-ink)] hover:border-[var(--studio-accent)] whitespace-nowrap transition-colors"
        >
          {historySaved ? (
            <>
              <Check className="h-4 w-4 text-[var(--studio-accent)]" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4" />
              <span>Save History</span>
            </>
          )}
        </button>
      </div>

      {/* Export & Quick Reset Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--studio-border-muted)] pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownloadTxt}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--studio-border-muted)] px-3 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)] whitespace-nowrap"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>TXT</span>
            <Download className="h-3 w-3 opacity-60" />
          </button>

          <button
            type="button"
            onClick={onDownloadJson}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--studio-border-muted)] px-3 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)] whitespace-nowrap"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>JSON</span>
            <Download className="h-3 w-3 opacity-60" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRandomize}
            aria-label="Randomize settings"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--studio-border-muted)] px-3 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)] whitespace-nowrap"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Random</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset settings to defaults"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--studio-border-muted)] px-3 text-xs font-medium text-[var(--studio-ink-muted)] hover:bg-[var(--studio-surface-alt)] hover:text-[var(--studio-ink)] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </section>
  );
};
