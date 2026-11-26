import React from 'react';
import { Menu, Moon, Shuffle, Sun } from 'lucide-react';
import { NavSection, ThemeMode } from '../types/photography';

interface TopBarProps {
  activeSection: NavSection;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onRandomizeAndOpen: () => void;
  onOpenMobileMenu: () => void;
}

const SECTION_TITLES: Record<NavSection, { full: string; short: string }> = {
  dashboard: { full: 'Studio Dashboard', short: 'Dashboard' },
  generator: { full: 'Photography Generator', short: 'Generator' },
  presets: { full: 'Photography Presets', short: 'Presets' },
  library: { full: 'Prompt Library & History', short: 'Library' },
  favorites: { full: 'Saved Favorites', short: 'Favorites' },
  settings: { full: 'Studio Settings', short: 'Settings' },
  about: { full: 'About LensCraft AI', short: 'About' },
};

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  theme,
  onToggleTheme,
  onRandomizeAndOpen,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--studio-border-muted)] bg-[var(--studio-canvas)]/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface)] text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)] lg:hidden shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-[var(--studio-ink)] whitespace-nowrap">
            <span className="sm:hidden">{SECTION_TITLES[activeSection].short}</span>
            <span className="hidden sm:inline">{SECTION_TITLES[activeSection].full}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface)] px-3 text-xs font-semibold text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)] whitespace-nowrap shrink-0 transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-[var(--studio-accent)]" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-[var(--studio-ink)]" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRandomizeAndOpen}
          className="neo-btn inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--studio-accent)] px-4 text-xs font-bold text-[#141518] whitespace-nowrap shrink-0"
        >
          <Shuffle className="h-4 w-4" />
          <span>Randomize</span>
        </button>
      </div>
    </header>
  );
};
