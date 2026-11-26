import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Copy, Heart, Search, Trash2 } from 'lucide-react';
import { LIBRARY_TEMPLATES } from '../data/catalog';
import { LibraryReferenceTemplate, SavedPromptItem } from '../types/photography';

interface LibraryViewProps {
  history: SavedPromptItem[];
  onLoadSavedPrompt: (item: SavedPromptItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onSaveToFavorites: (item: SavedPromptItem) => void;
  onLoadTemplate: (template: LibraryReferenceTemplate) => void;
  onCopyText: (text: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  history,
  onLoadSavedPrompt,
  onDeleteHistoryItem,
  onClearHistory,
  onSaveToFavorites,
  onLoadTemplate,
  onCopyText,
}) => {
  const [query, setQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.prompts.naturalLanguage.toLowerCase().includes(q) ||
        item.config.style.toLowerCase().includes(q)
    );
  }, [history, query]);

  return (
    <div className="space-y-8">
      {/* Prompt History Section */}
      <section className="space-y-4">
        <div className="neo-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--studio-ink)]">
              Prompt History ({history.length})
            </h2>
            <p className="mt-1 text-sm text-[var(--studio-ink-muted)]">
              Locally archived prompts created or copied during your sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--studio-ink-muted)]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search prompt history"
                placeholder="Search history..."
                className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] pl-9 pr-3 text-sm text-[var(--studio-ink)] focus:border-[var(--studio-accent)] focus:outline-none"
              />
            </div>

            {history.length > 0 && !confirmClear && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--studio-border-muted)] px-3 text-xs font-semibold text-[var(--studio-ink-muted)] hover:text-red-400 whitespace-nowrap"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear History</span>
              </button>
            )}

            {confirmClear && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white whitespace-nowrap"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-xl border border-[var(--studio-border-muted)] px-3 py-2 text-xs font-medium text-[var(--studio-ink)] whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="neo-card-flat flex flex-col items-start gap-3 p-6">
            <BookOpen className="h-6 w-6 text-[var(--studio-accent)]" />
            <p className="font-display text-base font-bold text-[var(--studio-ink)]">
              {history.length === 0 ? 'No prompt history recorded yet' : 'No matching history entries'}
            </p>
            <p className="text-sm text-[var(--studio-ink-muted)]">
              Save or copy a prompt inside the Photography Generator to build your personal studio log.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <article key={item.id} className="neo-card-flat p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--studio-ink-muted)]">
                      <span className="font-semibold text-[var(--studio-accent)]">
                        {item.config.style}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.language === 'id' ? 'ID' : 'EN'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-[var(--studio-ink)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
                      {item.prompts.naturalLanguage}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onCopyText(item.prompts.naturalLanguage)}
                      aria-label={`Copy prompt '${item.title}'`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--studio-border-muted)] px-3 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSaveToFavorites(item)}
                      aria-label={`Favorite '${item.title}'`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--studio-border-muted)] px-3 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)]"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      <span>Favorite</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onLoadSavedPrompt(item)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--studio-accent)] px-3 text-xs font-bold text-[#141518]"
                    >
                      <span>Load</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteHistoryItem(item.id)}
                      aria-label={`Delete history entry '${item.title}'`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--studio-border-muted)] text-[var(--studio-ink-muted)] hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Curated Optical Reference Library */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-[var(--studio-ink)]">
            Curated Optical Reference Templates
          </h3>
          <p className="text-sm text-[var(--studio-ink-muted)]">
            Study proven camera-lens-lighting combinations for specialized genres.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LIBRARY_TEMPLATES.map((tpl) => (
            <article key={tpl.id} className="neo-card flex flex-col justify-between p-5">
              <div>
                <p className="text-xs font-semibold text-[var(--studio-accent)]">
                  {tpl.style}
                </p>
                <h4 className="mt-1 font-display text-base font-bold text-[var(--studio-ink)]">
                  {tpl.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
                  {tpl.notes}
                </p>
                <p className="mt-3 font-mono text-xs text-[var(--studio-ink-muted)]">
                  {tpl.config.cameraType} · {tpl.config.lens} · {tpl.config.aperture} · {tpl.config.lighting}
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onLoadTemplate(tpl)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3.5 text-xs font-semibold text-[var(--studio-ink)] hover:border-[var(--studio-accent)]"
                >
                  <span>Load Reference in Generator</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
