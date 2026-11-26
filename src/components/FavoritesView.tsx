import React, { useMemo, useState } from 'react';
import { ArrowRight, Copy, Download, Heart, Search, Trash2 } from 'lucide-react';
import { SavedPromptItem } from '../types/photography';

interface FavoritesViewProps {
  favorites: SavedPromptItem[];
  onLoadSavedPrompt: (item: SavedPromptItem) => void;
  onRemoveFavorite: (id: string) => void;
  onCopyText: (text: string) => void;
  onDownloadItemTxt: (item: SavedPromptItem) => void;
  onDownloadItemJson: (item: SavedPromptItem) => void;
  onGoToGenerator: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onLoadSavedPrompt,
  onRemoveFavorite,
  onCopyText,
  onDownloadItemTxt,
  onDownloadItemJson,
  onGoToGenerator,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.prompts.naturalLanguage.toLowerCase().includes(q) ||
        item.config.style.toLowerCase().includes(q)
    );
  }, [favorites, query]);

  return (
    <div className="space-y-6">
      <div className="neo-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--studio-ink)]">
            Saved Favorites ({favorites.length})
          </h2>
          <p className="mt-1 text-sm text-[var(--studio-ink-muted)]">
            Prompts bookmarked locally in your browser for instant reuse and export.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--studio-ink-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search favorites"
            placeholder="Search saved favorites..."
            className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] pl-9 pr-3 text-sm text-[var(--studio-ink)] focus:border-[var(--studio-accent)] focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card-flat flex flex-col items-start gap-3 p-8">
          <Heart className="h-6 w-6 text-[var(--studio-accent)]" />
          <h3 className="font-display text-lg font-bold text-[var(--studio-ink)]">
            {favorites.length === 0 ? 'No favorite prompts saved yet' : 'No matching favorites'}
          </h3>
          <p className="max-w-md text-sm text-[var(--studio-ink-muted)]">
            Click &ldquo;Save Favorite&rdquo; in the Photography Generator output panel to store your best camera and lighting recipes here.
          </p>
          <button
            type="button"
            onClick={onGoToGenerator}
            className="neo-btn mt-1 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--studio-accent)] px-4 text-xs font-bold text-[#141518]"
          >
            <span>Open Photography Generator</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.id} className="neo-card flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[var(--studio-ink-muted)]">
                  <span className="font-semibold text-[var(--studio-accent)]">
                    {item.config.style}
                  </span>
                  <span className="font-mono tabular-nums">
                    {item.language === 'id' ? 'ID' : 'EN'} · {item.config.aspectRatio}
                  </span>
                </div>

                <h3 className="mt-1.5 font-display text-base font-bold text-[var(--studio-ink)]">
                  {item.title}
                </h3>

                <p className="mt-2 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-3 text-xs leading-relaxed text-[var(--studio-ink)]">
                  {item.prompts.naturalLanguage}
                </p>

                <p className="mt-2 font-mono text-[11px] text-[var(--studio-ink-muted)]">
                  Negative: {item.prompts.negativePrompt}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--studio-border-muted)] pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onCopyText(item.prompts.completePrompt)}
                    aria-label={`Copy favorite '${item.title}'`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--studio-border-muted)] px-2.5 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadItemTxt(item)}
                    aria-label={`Download TXT for '${item.title}'`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--studio-border-muted)] px-2.5 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadItemJson(item)}
                    aria-label={`Download JSON for '${item.title}'`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--studio-border-muted)] px-2.5 text-xs font-medium text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>JSON</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(item.id)}
                    aria-label={`Remove favorite '${item.title}'`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--studio-border-muted)] text-[var(--studio-ink-muted)] hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadSavedPrompt(item)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-[var(--studio-accent)] px-3 text-xs font-bold text-[#141518]"
                  >
                    <span>Load</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
