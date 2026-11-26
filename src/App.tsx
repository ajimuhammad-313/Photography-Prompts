import { useCallback, useEffect, useMemo, useState } from 'react';
import { AboutView } from './components/AboutView';
import { DashboardView } from './components/DashboardView';
import { FavoritesView } from './components/FavoritesView';
import { GeneratorView } from './components/GeneratorView';
import { LibraryView } from './components/LibraryView';
import { PresetsView } from './components/PresetsView';
import { SettingsView } from './components/SettingsView';
import { StudioSidebar } from './components/StudioSidebar';
import { TopBar } from './components/TopBar';
import {
  DEFAULT_CONFIG,
  DEFAULT_SETTINGS,
  PHOTOGRAPHY_STYLES,
} from './data/catalog';
import { evaluateCompatibility } from './engine/compatibility';
import {
  formatPromptAsJson,
  formatPromptAsTxt,
  generatePrompts,
} from './engine/promptGenerator';
import { generateCompatibleRandomConfig } from './engine/randomizer';
import {
  clearAllStoredPrompts,
  loadFavorites,
  loadHistory,
  loadSettings,
  saveFavorites,
  saveHistory,
  saveSettings,
} from './engine/storage';
import {
  LibraryReferenceTemplate,
  NavSection,
  PhotographyConfig,
  PhotographyPreset,
  PromptFormat,
  PromptLanguage,
  SavedPromptItem,
  StudioSettings,
} from './types/photography';

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildEntryTitle(config: PhotographyConfig): string {
  const subjectPart = config.customSubject.trim()
    ? config.customSubject.trim().slice(0, 42)
    : config.subjectCategory;
  return `${config.style} — ${subjectPart}`;
}

export default function App() {
  const [settings, setSettings] = useState<StudioSettings>(() => loadSettings());
  const [activeSection, setActiveSection] = useState<NavSection>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'generator';
    }
    return 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [config, setConfig] = useState<PhotographyConfig>(() => ({
    ...DEFAULT_CONFIG,
    cameraType: settings.defaultCameraType,
    quality: settings.defaultQuality,
  }));
  const [language, setLanguage] = useState<PromptLanguage>(settings.defaultLanguage);
  const [format, setFormat] = useState<PromptFormat>(settings.defaultFormat);

  const [favorites, setFavorites] = useState<SavedPromptItem[]>(() => loadFavorites());
  const [history, setHistory] = useState<SavedPromptItem[]>(() => loadHistory());
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Sync dark/light class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings]);

  const prompts = useMemo(() => generatePrompts(config, language), [config, language]);
  const issues = useMemo(() => evaluateCompatibility(config), [config]);

  const isFavorited = useMemo(() => {
    return favorites.some(
      (f) => f.prompts.naturalLanguage === prompts.naturalLanguage && f.language === language
    );
  }, [favorites, prompts.naturalLanguage, language]);

  const updateConfig = useCallback((patch: Partial<PhotographyConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const recordHistoryItem = useCallback(
    (cfg: PhotographyConfig, lang: PromptLanguage, fmt: PromptFormat) => {
      const generated = generatePrompts(cfg, lang);
      const entry: SavedPromptItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: buildEntryTitle(cfg),
        createdAt: new Date().toISOString(),
        language: lang,
        format: fmt,
        config: cfg,
        prompts: generated,
      };
      setHistory((prev) => {
        const deduped = prev.filter(
          (item) => item.prompts.naturalLanguage !== generated.naturalLanguage
        );
        const next = [entry, ...deduped].slice(0, 40);
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const handleToggleFavorite = useCallback(() => {
    if (isFavorited) {
      setFavorites((prev) => {
        const next = prev.filter(
          (f) =>
            !(
              f.prompts.naturalLanguage === prompts.naturalLanguage &&
              f.language === language
            )
        );
        saveFavorites(next);
        return next;
      });
      showToast('Removed from Favorites');
      return;
    }

    const item: SavedPromptItem = {
      id: `fav-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: buildEntryTitle(config),
      createdAt: new Date().toISOString(),
      language,
      format,
      config,
      prompts,
    };

    setFavorites((prev) => {
      const next = [item, ...prev];
      saveFavorites(next);
      return next;
    });
    showToast('Saved to Favorites');
  }, [isFavorited, prompts, language, format, config, showToast]);

  const handleRandomize = useCallback(
    (openGenerator = false) => {
      const randomCfg = generateCompatibleRandomConfig();
      setConfig(randomCfg);
      if (openGenerator) setActiveSection('generator');
      showToast(`Generated ${randomCfg.style} recipe`);
    },
    [showToast]
  );

  const handleResetConfig = useCallback(() => {
    setConfig({
      ...DEFAULT_CONFIG,
      cameraType: settings.defaultCameraType,
      quality: settings.defaultQuality,
    });
    showToast('Generator reset to defaults');
  }, [settings.defaultCameraType, settings.defaultQuality, showToast]);

  const handleSelectStyle = useCallback(
    (styleId: string) => {
      const found = PHOTOGRAPHY_STYLES.find((s) => s.id === styleId);
      setConfig((prev) => ({
        ...prev,
        style: styleId,
        lens: found ? found.suggestedLens : prev.lens,
        aperture: found ? found.suggestedAperture : prev.aperture,
        focalLength: found
          ? found.suggestedLens.match(/(\d+mm)/)?.[1] || prev.focalLength
          : prev.focalLength,
      }));
      setActiveSection('generator');
    },
    []
  );

  const handleApplyPreset = useCallback(
    (preset: PhotographyPreset) => {
      setConfig({
        ...DEFAULT_CONFIG,
        ...preset.config,
      });
      setActiveSection('generator');
      showToast(`Loaded "${preset.name}"`);
    },
    [showToast]
  );

  const handleLoadTemplate = useCallback(
    (tpl: LibraryReferenceTemplate) => {
      setConfig({
        ...DEFAULT_CONFIG,
        ...tpl.config,
      });
      setActiveSection('generator');
      showToast(`Loaded "${tpl.title}"`);
    },
    [showToast]
  );

  const handleLoadSavedPrompt = useCallback(
    (item: SavedPromptItem) => {
      setConfig(item.config);
      setLanguage(item.language);
      setFormat(item.format);
      setActiveSection('generator');
      showToast(`Loaded "${item.title}"`);
    },
    [showToast]
  );

  const handleDownloadTxt = useCallback(() => {
    const content = formatPromptAsTxt(config, prompts, format);
    const slug = config.style.toLowerCase().replace(/\s+/g, '-');
    triggerDownload(`lenscraft-${slug}.txt`, content, 'text/plain;charset=utf-8');
    showToast('Downloaded TXT prompt');
  }, [config, prompts, format, showToast]);

  const handleDownloadJson = useCallback(() => {
    const content = formatPromptAsJson(config, prompts);
    const slug = config.style.toLowerCase().replace(/\s+/g, '-');
    triggerDownload(`lenscraft-${slug}.json`, content, 'application/json;charset=utf-8');
    showToast('Downloaded JSON prompt');
  }, [config, prompts, showToast]);

  const handleCopyText = useCallback(
    async (text: string, label = 'Prompt') => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        }
      } catch {
        // Ignore restricted clipboard permissions
      }
      showToast(`${label} copied`);
    },
    [showToast]
  );

  const handleNotifyCopy = useCallback(
    (label: string) => {
      if (settings.autoSaveHistoryOnCopy) {
        recordHistoryItem(config, language, format);
      }
      showToast(`${label} copied`);
    },
    [settings.autoSaveHistoryOnCopy, recordHistoryItem, config, language, format, showToast]
  );

  const handleUpdateSettings = useCallback((patch: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setLanguage(DEFAULT_SETTINGS.defaultLanguage);
    setFormat(DEFAULT_SETTINGS.defaultFormat);
    showToast('Studio settings restored');
  }, [showToast]);

  const handleClearLocalData = useCallback(() => {
    clearAllStoredPrompts();
    setFavorites([]);
    setHistory([]);
    showToast('Cleared favorites and history');
  }, [showToast]);

  return (
    <div className="flex min-h-screen bg-[var(--studio-canvas)] text-[var(--studio-ink)]">
      <StudioSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        favoritesCount={favorites.length}
        historyCount={history.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          activeSection={activeSection}
          theme={settings.theme}
          onToggleTheme={() =>
            handleUpdateSettings({
              theme: settings.theme === 'dark' ? 'light' : 'dark',
            })
          }
          onRandomizeAndOpen={() => handleRandomize(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {activeSection === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveSection}
              onSelectStyle={handleSelectStyle}
              onApplyPreset={handleApplyPreset}
              onLoadSavedPrompt={handleLoadSavedPrompt}
              favorites={favorites}
              history={history}
            />
          )}

          {activeSection === 'generator' && (
            <GeneratorView
              config={config}
              prompts={prompts}
              issues={issues}
              showCompatibilityWarnings={settings.showCompatibilityWarnings}
              language={language}
              format={format}
              isFavorited={isFavorited}
              onUpdateConfig={updateConfig}
              onChangeLanguage={setLanguage}
              onChangeFormat={setFormat}
              onRandomize={() => handleRandomize(false)}
              onReset={handleResetConfig}
              onSaveFavorite={handleToggleFavorite}
              onSaveHistory={() => {
                recordHistoryItem(config, language, format);
                showToast('Saved to Prompt History');
              }}
              onDownloadTxt={handleDownloadTxt}
              onDownloadJson={handleDownloadJson}
              onNotifyCopy={handleNotifyCopy}
            />
          )}

          {activeSection === 'presets' && (
            <PresetsView onApplyPreset={handleApplyPreset} />
          )}

          {activeSection === 'library' && (
            <LibraryView
              history={history}
              onLoadSavedPrompt={handleLoadSavedPrompt}
              onDeleteHistoryItem={(id) => {
                setHistory((prev) => {
                  const next = prev.filter((item) => item.id !== id);
                  saveHistory(next);
                  return next;
                });
                showToast('History entry deleted');
              }}
              onClearHistory={() => {
                setHistory([]);
                saveHistory([]);
                showToast('Prompt history cleared');
              }}
              onSaveToFavorites={(item) => {
                setFavorites((prev) => {
                  if (prev.some((f) => f.prompts.naturalLanguage === item.prompts.naturalLanguage)) {
                    return prev;
                  }
                  const next = [{ ...item, id: `fav-${Date.now()}` }, ...prev];
                  saveFavorites(next);
                  return next;
                });
                showToast('Added to Favorites');
              }}
              onLoadTemplate={handleLoadTemplate}
              onCopyText={(text) => handleCopyText(text, 'Prompt')}
            />
          )}

          {activeSection === 'favorites' && (
            <FavoritesView
              favorites={favorites}
              onLoadSavedPrompt={handleLoadSavedPrompt}
              onRemoveFavorite={(id) => {
                setFavorites((prev) => {
                  const next = prev.filter((f) => f.id !== id);
                  saveFavorites(next);
                  return next;
                });
                showToast('Removed from Favorites');
              }}
              onCopyText={(text) => handleCopyText(text, 'Complete Prompt')}
              onDownloadItemTxt={(item) => {
                const txt = formatPromptAsTxt(item.config, item.prompts, item.format);
                triggerDownload('lenscraft-favorite.txt', txt, 'text/plain;charset=utf-8');
                showToast('Downloaded TXT');
              }}
              onDownloadItemJson={(item) => {
                const json = formatPromptAsJson(item.config, item.prompts);
                triggerDownload('lenscraft-favorite.json', json, 'application/json;charset=utf-8');
                showToast('Downloaded JSON');
              }}
              onGoToGenerator={() => setActiveSection('generator')}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetSettings={handleResetSettings}
              onClearLocalData={handleClearLocalData}
            />
          )}

          {activeSection === 'about' && (
            <AboutView onOpenGenerator={() => setActiveSection('generator')} />
          )}
        </main>
      </div>

      {/* Subtle Bottom-Right Studio Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="neo-card fixed bottom-5 right-5 z-50 px-4 py-2.5 text-xs font-bold text-[var(--studio-ink)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
