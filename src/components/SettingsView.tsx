import React, { useState } from 'react';
import { Moon, RotateCcw, Sun, Trash2 } from 'lucide-react';
import { CAMERA_TYPES, QUALITY_OPTIONS } from '../data/catalog';
import { StudioSettings } from '../types/photography';

interface SettingsViewProps {
  settings: StudioSettings;
  onUpdateSettings: (patch: Partial<StudioSettings>) => void;
  onResetSettings: () => void;
  onClearLocalData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  onClearLocalData,
}) => {
  const [confirmClearData, setConfirmClearData] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="neo-card p-6">
        <h2 className="font-display text-xl font-bold text-[var(--studio-ink)]">
          Studio Preferences
        </h2>
        <p className="mt-1 text-sm text-[var(--studio-ink-muted)]">
          Customize theme, default prompt language, compatibility assistant behavior, and local browser storage.
        </p>
      </div>

      {/* Appearance & Defaults */}
      <section className="neo-card space-y-5 p-6">
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--studio-border-muted)] pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-[var(--studio-ink)]">Interface Theme</p>
            <p className="text-xs text-[var(--studio-ink-muted)]">
              Dark charcoal is the default studio theme; switch to light studio paper anytime.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-1">
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                settings.theme === 'dark'
                  ? 'bg-[var(--studio-accent)] text-[#141518]'
                  : 'text-[var(--studio-ink-muted)]'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Dark Charcoal</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                settings.theme === 'light'
                  ? 'bg-[var(--studio-accent)] text-[#141518]'
                  : 'text-[var(--studio-ink-muted)]'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Light Studio</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="settings-default-lang" className="mb-1.5 block text-xs font-semibold text-[var(--studio-ink-muted)]">
              Default Output Language
            </label>
            <select
              id="settings-default-lang"
              value={settings.defaultLanguage}
              onChange={(e) =>
                onUpdateSettings({ defaultLanguage: e.target.value as 'en' | 'id' })
              }
              className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-sm text-[var(--studio-ink)]"
            >
              <option value="en">English</option>
              <option value="id">Indonesian (Bahasa Indonesia)</option>
            </select>
          </div>

          <div>
            <label htmlFor="settings-default-format" className="mb-1.5 block text-xs font-semibold text-[var(--studio-ink-muted)]">
              Default Prompt Format
            </label>
            <select
              id="settings-default-format"
              value={settings.defaultFormat}
              onChange={(e) =>
                onUpdateSettings({ defaultFormat: e.target.value as 'natural' | 'structured' })
              }
              className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-sm text-[var(--studio-ink)]"
            >
              <option value="natural">Natural Language Prompt</option>
              <option value="structured">Structured Photography Prompt</option>
            </select>
          </div>

          <div>
            <label htmlFor="settings-default-camera" className="mb-1.5 block text-xs font-semibold text-[var(--studio-ink-muted)]">
              Preferred Default Camera
            </label>
            <select
              id="settings-default-camera"
              value={settings.defaultCameraType}
              onChange={(e) => onUpdateSettings({ defaultCameraType: e.target.value })}
              className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-sm text-[var(--studio-ink)]"
            >
              {CAMERA_TYPES.map((cam) => (
                <option key={cam} value={cam}>
                  {cam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="settings-default-quality" className="mb-1.5 block text-xs font-semibold text-[var(--studio-ink-muted)]">
              Preferred Default Quality
            </label>
            <select
              id="settings-default-quality"
              value={settings.defaultQuality}
              onChange={(e) => onUpdateSettings({ defaultQuality: e.target.value })}
              className="h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-sm text-[var(--studio-ink)]"
            >
              {QUALITY_OPTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 border-t border-[var(--studio-border-muted)] pt-4">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-3.5">
            <div>
              <p className="text-sm font-semibold text-[var(--studio-ink)]">
                Smart Optical Compatibility Warnings
              </p>
              <p className="text-xs text-[var(--studio-ink-muted)]">
                Show guidance when lens, aperture, or lighting conflict with the chosen genre.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showCompatibilityWarnings}
              onChange={(e) =>
                onUpdateSettings({ showCompatibilityWarnings: e.target.checked })
              }
              className="h-4 w-4 accent-[#E5A93C]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-3.5">
            <div>
              <p className="text-sm font-semibold text-[var(--studio-ink)]">
                Auto-Save to History on Copy
              </p>
              <p className="text-xs text-[var(--studio-ink-muted)]">
                Automatically log prompts to local Prompt History whenever you copy them.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSaveHistoryOnCopy}
              onChange={(e) =>
                onUpdateSettings({ autoSaveHistoryOnCopy: e.target.checked })
              }
              className="h-4 w-4 accent-[#E5A93C]"
            />
          </label>
        </div>
      </section>

      {/* Data & Reset Actions */}
      <section className="neo-card flex flex-wrap items-center justify-between gap-4 p-6">
        <button
          type="button"
          onClick={onResetSettings}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--studio-border-muted)] px-4 text-xs font-semibold text-[var(--studio-ink)] hover:bg-[var(--studio-surface-alt)]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Studio Settings</span>
        </button>

        {!confirmClearData ? (
          <button
            type="button"
            onClick={() => setConfirmClearData(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-500/40 px-4 text-xs font-semibold text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Favorites & History</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClearLocalData();
                setConfirmClearData(false);
              }}
              className="h-10 rounded-xl bg-red-600 px-4 text-xs font-bold text-white"
            >
              Confirm Clear All Local Data
            </button>
            <button
              type="button"
              onClick={() => setConfirmClearData(false)}
              className="h-10 rounded-xl border border-[var(--studio-border-muted)] px-4 text-xs font-medium text-[var(--studio-ink)]"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
