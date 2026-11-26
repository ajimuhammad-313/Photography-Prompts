import React from 'react';
import {
  Aperture,
  BookOpen,
  Heart,
  Info,
  Layers,
  LayoutDashboard,
  Settings,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { NavSection } from '../types/photography';

interface StudioSidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  favoritesCount: number;
  historyCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generator', label: 'Photography Generator', icon: SlidersHorizontal },
  { id: 'presets', label: 'Photography Presets', icon: Layers },
  { id: 'library', label: 'Prompt Library', icon: BookOpen },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeSection,
  onSelectSection,
  favoritesCount,
  historyCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const handlePick = (section: NavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[var(--studio-surface)] text-[var(--studio-ink)]">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--studio-border-muted)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-[1.5px] border-[var(--studio-border)] bg-[var(--studio-accent)] text-[#141518]">
              <Aperture className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight tracking-tight">
                LensCraft AI
              </p>
              <p className="text-[11px] text-[var(--studio-ink-muted)]">
                Photography Studio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-[var(--studio-ink-muted)] hover:bg-[var(--studio-surface-alt)] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Primary studio navigation" className="space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const countText =
              item.id === 'favorites' && favoritesCount > 0
                ? String(favoritesCount)
                : item.id === 'library' && historyCount > 0
                  ? String(historyCount)
                  : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[1.5px] border-[var(--studio-border)] bg-[var(--studio-accent-soft)] text-[var(--studio-ink)] font-semibold'
                    : 'border border-transparent text-[var(--studio-ink-muted)] hover:bg-[var(--studio-surface-alt)] hover:text-[var(--studio-ink)]'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[var(--studio-accent)]' : ''
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {countText !== null && (
                  <span className="font-mono text-xs tabular-nums text-[var(--studio-ink-muted)]">
                    {countText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[var(--studio-border-muted)] p-4">
        <p className="text-xs font-medium text-[var(--studio-ink)]">
          Offline Local Engine
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--studio-ink-muted)]">
          All prompts, compatibility rules, and presets run locally in your browser without external APIs.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed studio sidebar */}
      <aside className="hidden lg:block lg:w-[256px] lg:shrink-0 lg:border-r lg:border-[var(--studio-border-muted)]">
        <div className="sticky top-0 h-screen overflow-y-auto">{navContent}</div>
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Studio navigation">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-[272px] max-w-[85vw] border-r border-[var(--studio-border)]">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
