import React, { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { PHOTOGRAPHY_PRESETS, PHOTOGRAPHY_STYLES } from '../data/catalog';
import { PhotographyPreset } from '../types/photography';
import { StudioImage } from './StudioImage';
import { StylePreviewGraphic } from './StylePreviewGraphic';

interface PresetsViewProps {
  onApplyPreset: (preset: PhotographyPreset) => void;
}

export const PresetsView: React.FC<PresetsViewProps> = ({ onApplyPreset }) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    for (const p of PHOTOGRAPHY_PRESETS) set.add(p.category);
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return PHOTOGRAPHY_PRESETS.filter((preset) => {
      const matchesCat = categoryFilter === 'All' || preset.category === categoryFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        preset.name.toLowerCase().includes(q) ||
        preset.summary.toLowerCase().includes(q) ||
        (preset.config.style || '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="neo-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--studio-ink)]">
            Photography Preset Library
          </h2>
          <p className="mt-1 text-sm text-[var(--studio-ink-muted)]">
            15 complete studio recipes. Selecting any preset populates camera, lens, lighting, and color settings automatically.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--studio-ink-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search photography presets"
            placeholder="Search presets..."
            className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] pl-9 pr-3 text-sm text-[var(--studio-ink)] placeholder:text-[var(--studio-ink-muted)] focus:border-[var(--studio-accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              categoryFilter === cat
                ? 'border-[var(--studio-accent)] bg-[var(--studio-accent)] text-[#141518]'
                : 'border-[var(--studio-border-muted)] bg-[var(--studio-surface)] text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card-flat p-8 text-center">
          <p className="font-display text-base font-bold text-[var(--studio-ink)]">
            No presets match &ldquo;{query}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategoryFilter('All');
            }}
            className="mt-3 text-xs font-semibold text-[var(--studio-accent)] hover:underline"
          >
            Reset search and filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((preset) => {
            const matchedStyle =
              PHOTOGRAPHY_STYLES.find((s) => s.id === preset.config.style) ||
              PHOTOGRAPHY_STYLES[0];

            return (
              <article
                key={preset.id}
                className="neo-card flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden border-b border-[var(--studio-border-muted)]">
                    {preset.previewImage ? (
                      <StudioImage
                        src={preset.previewImage}
                        alt={preset.name}
                        className="h-full w-full object-cover"
                        fallbackTitle={preset.name}
                      />
                    ) : (
                      <StylePreviewGraphic style={matchedStyle} className="h-full w-full rounded-none border-0" />
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[var(--studio-ink-muted)]">
                      <span className="font-semibold text-[var(--studio-accent)]">
                        {preset.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{preset.config.style}</span>
                    </div>

                    <h3 className="mt-1.5 font-display text-base font-bold text-[var(--studio-ink)]">
                      {preset.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
                      {preset.summary}
                    </p>

                    <p className="mt-3 font-mono text-xs text-[var(--studio-ink-muted)]">
                      {preset.config.cameraType} · {preset.config.lens} · {preset.config.aperture} · {preset.config.lighting}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--studio-border-muted)] px-5 py-3">
                  <button
                    type="button"
                    onClick={() => onApplyPreset(preset)}
                    className="neo-btn inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[var(--studio-accent)] px-4 text-xs font-bold text-[#141518]"
                  >
                    <span>Load Preset in Generator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
