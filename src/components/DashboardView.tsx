import React from 'react';
import { ArrowRight, BookOpen, Heart, Layers, SlidersHorizontal } from 'lucide-react';
import {
  PHOTOGRAPHY_PRESETS,
  PHOTOGRAPHY_STYLES,
  STUDIO_IMAGES,
} from '../data/catalog';
import {
  NavSection,
  PhotographyPreset,
  SavedPromptItem,
} from '../types/photography';
import { StudioImage } from './StudioImage';
import { StylePreviewGraphic } from './StylePreviewGraphic';

interface DashboardViewProps {
  onNavigate: (section: NavSection) => void;
  onSelectStyle: (styleId: string) => void;
  onApplyPreset: (preset: PhotographyPreset) => void;
  onLoadSavedPrompt: (item: SavedPromptItem) => void;
  favorites: SavedPromptItem[];
  history: SavedPromptItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectStyle,
  onApplyPreset,
  onLoadSavedPrompt,
  favorites,
  history,
}) => {
  const featuredStyles = PHOTOGRAPHY_STYLES.slice(0, 4);
  const featuredPresets = PHOTOGRAPHY_PRESETS.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Split-Screen Studio Hero */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="neo-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wider text-[var(--studio-accent)]">
              LensCraft AI · Photography Prompt Studio
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[var(--studio-ink)] sm:text-4xl [text-wrap:balance]">
              Create Better Photography Prompts
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[var(--studio-ink-muted)]">
              This tool empowers photographers to generate precise prompts for any AI engine. Dial in real camera bodies, prime lenses, aperture physics, directional lighting, and bilingual output completely offline.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('generator')}
              className="neo-btn inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--studio-accent)] px-5 text-sm font-bold text-[#141518] whitespace-nowrap"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Open Generator</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('presets')}
              className="inline-flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[var(--studio-border)] bg-[var(--studio-surface-alt)] px-5 text-sm font-semibold text-[var(--studio-ink)] hover:bg-[var(--studio-surface)] whitespace-nowrap transition-colors"
            >
              <Layers className="h-4 w-4" />
              <span>Explore 15 Presets</span>
            </button>
          </div>
        </div>

        <div className="neo-card overflow-hidden lg:col-span-6">
          <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[340px]">
            <StudioImage
              src={STUDIO_IMAGES.heroCamera}
              alt="Medium-format studio camera with 85mm prime lens on a charcoal photography workbench"
              className="h-full w-full object-cover"
              fallbackTitle="LensCraft AI Studio Workbench"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-mono text-xs text-white/80">
                Medium Format · 85mm f/1.8 · Soft Window Light
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">
                Optical Precision Without Cloud Dependencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Studio Overview Strip */}
      <section aria-label="Studio inventory summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate('generator')}
          className="neo-card-flat p-5 text-left transition-colors hover:border-[var(--studio-accent)]"
        >
          <p className="text-xs font-medium text-[var(--studio-ink-muted)]">Photography Styles</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--studio-ink)] tabular-nums">
            {PHOTOGRAPHY_STYLES.length}
          </p>
          <p className="mt-1 text-xs text-[var(--studio-ink-muted)]">Visual & optical profiles</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('presets')}
          className="neo-card-flat p-5 text-left transition-colors hover:border-[var(--studio-accent)]"
        >
          <p className="text-xs font-medium text-[var(--studio-ink-muted)]">Studio Presets</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--studio-ink)] tabular-nums">
            {PHOTOGRAPHY_PRESETS.length}
          </p>
          <p className="mt-1 text-xs text-[var(--studio-ink-muted)]">One-click configurations</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('favorites')}
          className="neo-card-flat p-5 text-left transition-colors hover:border-[var(--studio-accent)]"
        >
          <p className="text-xs font-medium text-[var(--studio-ink-muted)]">Saved Favorites</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--studio-ink)] tabular-nums">
            {favorites.length}
          </p>
          <p className="mt-1 text-xs text-[var(--studio-ink-muted)]">Stored locally</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('library')}
          className="neo-card-flat p-5 text-left transition-colors hover:border-[var(--studio-accent)]"
        >
          <p className="text-xs font-medium text-[var(--studio-ink-muted)]">Prompt History</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[var(--studio-ink)] tabular-nums">
            {history.length}
          </p>
          <p className="mt-1 text-xs text-[var(--studio-ink-muted)]">Recent studio captures</p>
        </button>
      </section>

      {/* Visual Showcase: 4 Core Disciplines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[var(--studio-ink)]">
              Studio Discipline Previews
            </h3>
            <p className="text-sm text-[var(--studio-ink-muted)]">
              Select a genre to start building with tailored lens and lighting defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('generator')}
            className="text-xs font-semibold text-[var(--studio-accent)] hover:underline whitespace-nowrap"
          >
            View all 20 styles
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              styleId: 'Portrait Photography',
              image: STUDIO_IMAGES.portraitGolden,
              meta: '85mm · f/1.4 · Golden Hour',
              caption: 'Expressive character framing with creamy optical bokeh.',
            },
            {
              styleId: 'Street Photography',
              image: STUDIO_IMAGES.streetCinematic,
              meta: '35mm · f/2 · Blue Hour',
              caption: 'Candid urban geometry and reflective wet pavement.',
            },
            {
              styleId: 'Macro Photography',
              image: STUDIO_IMAGES.macroNature,
              meta: '105mm Macro · f/5.6 · Rim Light',
              caption: 'Close-focus 1:1 surface detail and botanical textures.',
            },
            {
              styleId: 'Product Photography',
              image: STUDIO_IMAGES.productStudio,
              meta: '105mm · f/8 · Softbox Key',
              caption: 'Controlled commercial shadows and crisp edge clarity.',
            },
          ].map((card) => (
            <button
              key={card.styleId}
              type="button"
              onClick={() => onSelectStyle(card.styleId)}
              className="neo-card group overflow-hidden text-left transition-transform hover:-translate-y-0.5"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <StudioImage
                  src={card.image}
                  alt={card.styleId}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackTitle={card.styleId}
                />
              </div>
              <div className="p-4">
                <p className="font-mono text-[11px] text-[var(--studio-ink-muted)]">
                  {card.meta}
                </p>
                <p className="mt-1 font-display text-base font-bold text-[var(--studio-ink)]">
                  {card.styleId}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--studio-ink-muted)]">
                  {card.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Start Presets + Style Preview Strip */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-[var(--studio-ink)]">
              Ready-to-Use Presets
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('presets')}
              className="text-xs font-semibold text-[var(--studio-accent)] hover:underline whitespace-nowrap"
            >
              All 15 presets
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {featuredPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="neo-card-flat flex flex-col justify-between p-4 text-left transition-colors hover:border-[var(--studio-accent)]"
              >
                <div>
                  <p className="text-xs font-medium text-[var(--studio-accent)]">
                    {preset.category}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-[var(--studio-ink)]">
                    {preset.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--studio-ink-muted)]">
                    {preset.summary}
                  </p>
                </div>
                <p className="mt-3 font-mono text-[11px] text-[var(--studio-ink-muted)]">
                  {preset.config.lens} · {preset.config.aperture} · {preset.config.aspectRatio}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-[var(--studio-ink)]">
              Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-[var(--studio-accent)] hover:underline whitespace-nowrap"
            >
              Open Library
            </button>
          </div>

          {history.length === 0 && favorites.length === 0 ? (
            <div className="neo-card-flat flex flex-col items-start justify-between gap-4 p-6">
              <div className="space-y-2">
                <BookOpen className="h-6 w-6 text-[var(--studio-accent)]" />
                <p className="font-display text-base font-bold text-[var(--studio-ink)]">
                  Your local prompt archive is empty
                </p>
                <p className="text-sm leading-relaxed text-[var(--studio-ink-muted)]">
                  Generate a prompt in the studio, save it to History or Favorites, and it will appear right here for instant recall.
                </p>
              </div>
              <div className="grid w-full grid-cols-2 gap-3 pt-2">
                {featuredStyles.slice(0, 2).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onSelectStyle(st.id)}
                    className="rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-2.5 text-left hover:border-[var(--studio-accent)]"
                  >
                    <StylePreviewGraphic style={st} className="h-14 w-full" />
                    <p className="mt-2 truncate text-xs font-semibold text-[var(--studio-ink)]">
                      {st.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[...favorites.slice(0, 2), ...history.slice(0, 3)]
                .slice(0, 4)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onLoadSavedPrompt(item)}
                    className="neo-card-flat flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:border-[var(--studio-accent)]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-[var(--studio-ink)]">
                        {item.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--studio-ink-muted)]">
                        {item.prompts.naturalLanguage}
                      </p>
                    </div>
                    <Heart className="h-4 w-4 shrink-0 text-[var(--studio-ink-muted)]" />
                  </button>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
