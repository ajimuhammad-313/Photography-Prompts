import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import {
  APERTURE_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  CAMERA_ANGLE_OPTIONS,
  CAMERA_TYPES,
  COLOR_GRADING_OPTIONS,
  COMPOSITION_OPTIONS,
  DEPTH_OF_FIELD_OPTIONS,
  ENVIRONMENT_OPTIONS,
  FACIAL_EXPRESSION_OPTIONS,
  FOCAL_LENGTH_OPTIONS,
  FOCUS_DISTANCE_OPTIONS,
  HUMAN_DETAIL_OPTIONS,
  ISO_OPTIONS,
  LENS_OPTIONS,
  LIGHTING_OPTIONS,
  PHOTOGRAPHY_STYLES,
  PORTRAIT_FRAMING_OPTIONS,
  POSE_OPTIONS,
  QUALITY_OPTIONS,
  SENSOR_FORMAT_OPTIONS,
  SHUTTER_SPEED_OPTIONS,
  SUBJECT_CATEGORIES,
  WEATHER_OPTIONS,
} from '../data/catalog';
import {
  CompatibilityIssue,
  GeneratedPrompts,
  PhotographyConfig,
  PromptFormat,
  PromptLanguage,
} from '../types/photography';
import { PromptPreviewPanel } from './PromptPreviewPanel';
import { StylePreviewGraphic } from './StylePreviewGraphic';

interface GeneratorViewProps {
  config: PhotographyConfig;
  prompts: GeneratedPrompts;
  issues: CompatibilityIssue[];
  showCompatibilityWarnings: boolean;
  language: PromptLanguage;
  format: PromptFormat;
  isFavorited: boolean;
  onUpdateConfig: (patch: Partial<PhotographyConfig>) => void;
  onChangeLanguage: (lang: PromptLanguage) => void;
  onChangeFormat: (fmt: PromptFormat) => void;
  onRandomize: () => void;
  onReset: () => void;
  onSaveFavorite: () => void;
  onSaveHistory: () => void;
  onDownloadTxt: () => void;
  onDownloadJson: () => void;
  onNotifyCopy: (label: string) => void;
}

const STYLE_GROUPS = [
  'All',
  'Editorial & People',
  'Cinema & Street',
  'Commercial & Detail',
  'Nature & Space',
] as const;

const ASPECT_DIMS: Record<string, [number, number]> = {
  '1:1': [22, 22],
  '4:5': [18, 22],
  '3:4': [18, 24],
  '2:3': [16, 24],
  '3:2': [24, 16],
  '9:16': [14, 24],
  '16:9': [26, 15],
  '21:9': [28, 12],
};

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  config,
  prompts,
  issues,
  showCompatibilityWarnings,
  language,
  format,
  isFavorited,
  onUpdateConfig,
  onChangeLanguage,
  onChangeFormat,
  onRandomize,
  onReset,
  onSaveFavorite,
  onSaveHistory,
  onDownloadTxt,
  onDownloadJson,
  onNotifyCopy,
}) => {
  const [styleGroup, setStyleGroup] = useState<(typeof STYLE_GROUPS)[number]>('All');
  const [dismissedIssueIds, setDismissedIssueIds] = useState<string[]>([]);

  const filteredStyles = useMemo(() => {
    if (styleGroup === 'All') return PHOTOGRAPHY_STYLES;
    return PHOTOGRAPHY_STYLES.filter((s) => s.group === styleGroup);
  }, [styleGroup]);

  const visibleIssues = useMemo(
    () => issues.filter((issue) => !dismissedIssueIds.includes(issue.id)),
    [issues, dismissedIssueIds]
  );

  const toggleHumanDetail = (detail: string) => {
    const exists = config.humanDetails.includes(detail);
    const next = exists
      ? config.humanDetails.filter((d) => d !== detail)
      : [...config.humanDetails, detail];
    onUpdateConfig({ humanDetails: next });
  };

  const applyRecommendation = (issue: CompatibilityIssue) => {
    onUpdateConfig(issue.patch);
    setDismissedIssueIds((prev) => prev.filter((id) => id !== issue.id));
  };

  const selectClass =
    'h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-sm text-[var(--studio-ink)] focus:border-[var(--studio-accent)] focus:outline-none';
  const inputClass =
    'h-10 w-full rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] px-3 text-sm text-[var(--studio-ink)] placeholder:text-[var(--studio-ink-muted)]/70 focus:border-[var(--studio-accent)] focus:outline-none';
  const labelClass = 'block text-xs font-semibold text-[var(--studio-ink-muted)] mb-1.5';

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
      {/* Left Workbench Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface)] px-4 py-2.5 xl:hidden">
          <span className="font-mono text-xs text-[var(--studio-ink-muted)] truncate">
            {prompts.wordCount} words · {config.aspectRatio} · {config.aperture}
          </span>
          <button
            type="button"
            onClick={() =>
              document.getElementById('prompt-output-panel')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="rounded-lg bg-[var(--studio-accent)] px-3 py-1.5 text-xs font-bold text-[#141518] whitespace-nowrap shrink-0"
          >
            View Output
          </button>
        </div>

        {/* Smart Compatibility System */}
        {showCompatibilityWarnings && (
          <section aria-label="Smart compatibility assistant">
            {visibleIssues.length > 0 ? (
              <div
                data-testid="compatibility-warnings"
                className="neo-card space-y-3 border-[var(--studio-accent)]/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[var(--studio-accent)]" />
                    <h2 className="font-display text-sm font-bold text-[var(--studio-ink)]">
                      Smart Optical Compatibility ({visibleIssues.length})
                    </h2>
                  </div>
                  <span className="text-xs text-[var(--studio-ink-muted)]">
                    Optional guidance — manual overrides always allowed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {visibleIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-3 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {issue.severity === 'warning' ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Lightbulb className="h-3.5 w-3.5 text-[var(--studio-accent)] shrink-0" />
                          )}
                          <p className="text-xs font-bold text-[var(--studio-ink)]">
                            {issue.title}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed text-[var(--studio-ink-muted)]">
                          {issue.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => applyRecommendation(issue)}
                          className="rounded-lg bg-[var(--studio-accent)] px-3 py-1.5 text-xs font-bold text-[#141518] hover:opacity-90 whitespace-nowrap"
                        >
                          {issue.recommendationLabel}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDismissedIssueIds((prev) => [...prev, issue.id])
                          }
                          className="rounded-lg border border-[var(--studio-border-muted)] px-2.5 py-1.5 text-xs font-medium text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)] whitespace-nowrap"
                        >
                          Keep Override
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="neo-card-flat flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-[var(--studio-ink-muted)]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    Optical settings are compatible: {config.style} paired with {config.lens} at {config.aperture}.
                  </span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 1. Photography Style Category Selector */}
        <section className="neo-card space-y-4 p-5" aria-labelledby="section-style-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="section-style-heading" className="font-display text-base font-bold text-[var(--studio-ink)]">
                01. Photography Style
              </h2>
              <p className="text-xs text-[var(--studio-ink-muted)]">
                Choose from 20 curated visual photography categories.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] p-1">
              {STYLE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setStyleGroup(group)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    styleGroup === group
                      ? 'bg-[var(--studio-surface)] text-[var(--studio-ink)] shadow-sm'
                      : 'text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {filteredStyles.map((st) => {
              const selected = config.style === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onUpdateConfig({ style: st.id })}
                  aria-pressed={selected}
                  className={`flex flex-col rounded-xl border p-2.5 text-left transition-colors ${
                    selected
                      ? 'border-[1.5px] border-[var(--studio-accent)] bg-[var(--studio-accent-soft)]'
                      : 'border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] hover:border-[var(--studio-ink-muted)]'
                  }`}
                >
                  <StylePreviewGraphic style={st} className="h-16 w-full" />
                  <p className="mt-2 font-display text-xs font-bold text-[var(--studio-ink)]">
                    {st.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[var(--studio-ink-muted)]">
                    {st.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Camera and Equipment */}
        <section className="neo-card space-y-4 p-5" aria-labelledby="section-camera-heading">
          <div>
            <h2 id="section-camera-heading" className="font-display text-base font-bold text-[var(--studio-ink)]">
              02. Camera & Optical Equipment
            </h2>
            <p className="text-xs text-[var(--studio-ink-muted)]">
              Configure camera body, prime or zoom lens, exposure triangle, and sensor format.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label htmlFor="select-camera-type" className={labelClass}>
                Camera Type
              </label>
              <select
                id="select-camera-type"
                value={config.cameraType}
                onChange={(e) => onUpdateConfig({ cameraType: e.target.value })}
                className={selectClass}
              >
                {CAMERA_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-lens" className={labelClass}>
                Lens Selection
              </label>
              <select
                id="select-lens"
                value={config.lens}
                onChange={(e) => {
                  const lens = e.target.value;
                  const parsedFocal = lens.match(/(\d+mm)/)?.[1];
                  onUpdateConfig(parsedFocal ? { lens, focalLength: parsedFocal } : { lens });
                }}
                className={selectClass}
              >
                {LENS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-aperture" className={labelClass}>
                Aperture
              </label>
              <select
                id="select-aperture"
                value={config.aperture}
                onChange={(e) => onUpdateConfig({ aperture: e.target.value })}
                className={selectClass}
              >
                {APERTURE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-iso" className={labelClass}>
                ISO Sensitivity
              </label>
              <select
                id="select-iso"
                value={config.iso}
                onChange={(e) => onUpdateConfig({ iso: e.target.value })}
                className={selectClass}
              >
                {ISO_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-shutter" className={labelClass}>
                Shutter Speed
              </label>
              <select
                id="select-shutter"
                value={config.shutterSpeed}
                onChange={(e) => onUpdateConfig({ shutterSpeed: e.target.value })}
                className={selectClass}
              >
                {SHUTTER_SPEED_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-focal-length" className={labelClass}>
                Focal Length
              </label>
              <select
                id="select-focal-length"
                value={config.focalLength}
                onChange={(e) => onUpdateConfig({ focalLength: e.target.value })}
                className={selectClass}
              >
                {FOCAL_LENGTH_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-dof" className={labelClass}>
                Depth of Field
              </label>
              <select
                id="select-dof"
                value={config.depthOfField}
                onChange={(e) => onUpdateConfig({ depthOfField: e.target.value })}
                className={selectClass}
              >
                {DEPTH_OF_FIELD_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-focus-distance" className={labelClass}>
                Focus Distance
              </label>
              <select
                id="select-focus-distance"
                value={config.focusDistance}
                onChange={(e) => onUpdateConfig({ focusDistance: e.target.value })}
                className={selectClass}
              >
                {FOCUS_DISTANCE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-sensor" className={labelClass}>
                Camera Sensor Format
              </label>
              <select
                id="select-sensor"
                value={config.sensorFormat}
                onChange={(e) => onUpdateConfig({ sensorFormat: e.target.value })}
                className={selectClass}
              >
                {SENSOR_FORMAT_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-custom-camera" className={labelClass}>
              Custom Camera or Film Stock Description (Optional)
            </label>
            <input
              id="input-custom-camera"
              type="text"
              value={config.customCamera}
              onChange={(e) => onUpdateConfig({ customCamera: e.target.value })}
              placeholder="e.g., Leica M6 rangefinder loaded with Kodak Portra 400"
              className={inputClass}
            />
          </div>
        </section>

        {/* 3. Lighting, Camera Angles & Composition */}
        <section className="neo-card space-y-4 p-5" aria-labelledby="section-lighting-heading">
          <div>
            <h2 id="section-lighting-heading" className="font-display text-base font-bold text-[var(--studio-ink)]">
              03. Lighting, Camera Angles & Composition
            </h2>
            <p className="text-xs text-[var(--studio-ink-muted)]">
              Shape light direction, camera vantage point, and visual framing rules.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="select-lighting" className={labelClass}>
                Lighting Technique
              </label>
              <select
                id="select-lighting"
                value={config.lighting}
                onChange={(e) => onUpdateConfig({ lighting: e.target.value })}
                className={selectClass}
              >
                {LIGHTING_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-camera-angle" className={labelClass}>
                Camera Angle
              </label>
              <select
                id="select-camera-angle"
                value={config.cameraAngle}
                onChange={(e) => onUpdateConfig({ cameraAngle: e.target.value })}
                className={selectClass}
              >
                {CAMERA_ANGLE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-composition" className={labelClass}>
                Composition Rule
              </label>
              <select
                id="select-composition"
                value={config.composition}
                onChange={(e) => onUpdateConfig({ composition: e.target.value })}
                className={selectClass}
              >
                {COMPOSITION_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-custom-lighting" className={labelClass}>
              Custom Lighting Note (Optional)
            </label>
            <input
              id="input-custom-lighting"
              type="text"
              value={config.customLighting}
              onChange={(e) => onUpdateConfig({ customLighting: e.target.value })}
              placeholder="e.g., diffused north-facing skylight with subtle silver bounce fill"
              className={inputClass}
            />
          </div>
        </section>

        {/* 4. Subject, Pose, Expression & Realistic Human Details */}
        <section className="neo-card space-y-4 p-5" aria-labelledby="section-subject-heading">
          <div>
            <h2 id="section-subject-heading" className="font-display text-base font-bold text-[var(--studio-ink)]">
              04. Subject, Pose & Expression
            </h2>
            <p className="text-xs text-[var(--studio-ink-muted)]">
              Describe your primary subject, framing distance, posture, and realistic skin/hair details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="select-subject-category" className={labelClass}>
                Subject Category
              </label>
              <select
                id="select-subject-category"
                value={config.subjectCategory}
                onChange={(e) => onUpdateConfig({ subjectCategory: e.target.value })}
                className={selectClass}
              >
                {SUBJECT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-portrait-framing" className={labelClass}>
                Framing / Shot Distance
              </label>
              <select
                id="select-portrait-framing"
                value={config.portraitFraming}
                onChange={(e) => onUpdateConfig({ portraitFraming: e.target.value })}
                className={selectClass}
              >
                {PORTRAIT_FRAMING_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-pose" className={labelClass}>
                Pose
              </label>
              <select
                id="select-pose"
                value={config.pose}
                onChange={(e) => onUpdateConfig({ pose: e.target.value })}
                className={selectClass}
              >
                {POSE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-expression" className={labelClass}>
                Facial Expression
              </label>
              <select
                id="select-expression"
                value={config.facialExpression}
                onChange={(e) => onUpdateConfig({ facialExpression: e.target.value })}
                className={selectClass}
              >
                {FACIAL_EXPRESSION_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-custom-subject" className={labelClass}>
              Custom Subject Description
            </label>
            <input
              id="input-custom-subject"
              type="text"
              value={config.customSubject}
              onChange={(e) => onUpdateConfig({ customSubject: e.target.value })}
              placeholder="e.g., weathered carpenter inspecting hand-planed walnut timber"
              className={inputClass}
            />
            {config.useEnhancer && prompts.enhancedSubject && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-[var(--studio-ink-muted)]">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--studio-accent)]" />
                <span>Enhanced: {prompts.enhancedSubject}</span>
              </p>
            )}
          </div>

          <div>
            <p className={labelClass}>Realistic Human Detail Options</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {HUMAN_DETAIL_OPTIONS.map((detail) => {
                const checked = config.humanDetails.includes(detail);
                return (
                  <label
                    key={detail}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                      checked
                        ? 'border-[var(--studio-accent)] bg-[var(--studio-accent-soft)] text-[var(--studio-ink)]'
                        : 'border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] text-[var(--studio-ink-muted)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleHumanDetail(detail)}
                      className="h-4 w-4 accent-[#E5A93C]"
                    />
                    <span>{detail}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Environment, Weather & Color Grading */}
        <section className="neo-card space-y-4 p-5" aria-labelledby="section-environment-heading">
          <div>
            <h2 id="section-environment-heading" className="font-display text-base font-bold text-[var(--studio-ink)]">
              05. Environment, Atmosphere & Color Grading
            </h2>
            <p className="text-xs text-[var(--studio-ink-muted)]">
              Set location context, weather mood, and photographic film or color treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="select-environment" className={labelClass}>
                Environment Category
              </label>
              <select
                id="select-environment"
                value={config.environment}
                onChange={(e) => onUpdateConfig({ environment: e.target.value })}
                className={selectClass}
              >
                {ENVIRONMENT_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-weather" className={labelClass}>
                Weather & Atmosphere
              </label>
              <select
                id="select-weather"
                value={config.weather}
                onChange={(e) => onUpdateConfig({ weather: e.target.value })}
                className={selectClass}
              >
                {WEATHER_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-color-grading" className={labelClass}>
                Color Grading
              </label>
              <select
                id="select-color-grading"
                value={config.colorGrading}
                onChange={(e) => onUpdateConfig({ colorGrading: e.target.value })}
                className={selectClass}
              >
                {COLOR_GRADING_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-custom-background" className={labelClass}>
              Custom Background Description (Optional)
            </label>
            <input
              id="input-custom-background"
              type="text"
              value={config.customBackground}
              onChange={(e) => onUpdateConfig({ customBackground: e.target.value })}
              placeholder="e.g., quiet limestone courtyard with blurred olive foliage"
              className={inputClass}
            />
          </div>
        </section>

        {/* 6. Aspect Ratio, Quality & Extra Details */}
        <section className="neo-card space-y-4 p-5" aria-labelledby="section-format-heading">
          <div>
            <h2 id="section-format-heading" className="font-display text-base font-bold text-[var(--studio-ink)]">
              06. Image Format, Quality & Custom Details
            </h2>
            <p className="text-xs text-[var(--studio-ink-muted)]">
              Choose frame aspect ratio, output detail tier, and any custom photographic notes.
            </p>
          </div>

          <div>
            <p className={labelClass}>Aspect Ratio</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {ASPECT_RATIO_OPTIONS.map((ratio) => {
                const selected = config.aspectRatio === ratio;
                const [w, h] = ASPECT_DIMS[ratio] || [20, 20];
                return (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => onUpdateConfig({ aspectRatio: ratio })}
                    aria-pressed={selected}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-mono font-semibold transition-colors ${
                      selected
                        ? 'border-[1.5px] border-[var(--studio-accent)] bg-[var(--studio-accent-soft)] text-[var(--studio-ink)]'
                        : 'border-[var(--studio-border-muted)] bg-[var(--studio-surface-alt)] text-[var(--studio-ink-muted)] hover:text-[var(--studio-ink)]'
                    }`}
                  >
                    <span
                      className="block rounded-[2px] border border-current"
                      style={{ width: `${w}px`, height: `${h}px` }}
                      aria-hidden="true"
                    />
                    <span>{ratio}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="select-quality" className={labelClass}>
                Quality Level
              </label>
              <select
                id="select-quality"
                value={config.quality}
                onChange={(e) => onUpdateConfig({ quality: e.target.value })}
                className={selectClass}
              >
                {QUALITY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="input-custom-details" className={labelClass}>
                Additional Photography Details (Optional)
              </label>
              <input
                id="input-custom-details"
                type="text"
                value={config.customDetails}
                onChange={(e) => onUpdateConfig({ customDetails: e.target.value })}
                placeholder="e.g., subtle halation, tactile linen grain, 1/4 black mist filter"
                className={inputClass}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right Sticky Prompt Preview Panel */}
      <div className="xl:sticky xl:top-20">
        <PromptPreviewPanel
          config={config}
          prompts={prompts}
          language={language}
          format={format}
          onChangeLanguage={onChangeLanguage}
          onChangeFormat={onChangeFormat}
          onToggleEnhancer={() => onUpdateConfig({ useEnhancer: !config.useEnhancer })}
          onRandomize={onRandomize}
          onReset={onReset}
          onSaveFavorite={onSaveFavorite}
          onSaveHistory={onSaveHistory}
          onDownloadTxt={onDownloadTxt}
          onDownloadJson={onDownloadJson}
          onNotifyCopy={onNotifyCopy}
          isFavorited={isFavorited}
        />
      </div>
    </div>
  );
};
