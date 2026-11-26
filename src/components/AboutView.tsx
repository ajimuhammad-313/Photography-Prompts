import React from 'react';
import { Aperture, Cpu, Globe2, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { STUDIO_IMAGES } from '../data/catalog';
import { StudioImage } from './StudioImage';

interface AboutViewProps {
  onOpenGenerator: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenGenerator }) => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="neo-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-7">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[var(--studio-accent)]">
                LensCraft AI
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[var(--studio-ink)] sm:text-3xl">
                Create Better Photography Prompts
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
                This tool empowers photographers to generate precise prompts for any AI engine. Built as a fast, distraction-free studio workbench, LensCraft AI translates real optical knowledge—camera sensors, prime focal lengths, aperture depth of field, and studio lighting—into grammatically coherent prompts.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onOpenGenerator}
                className="neo-btn inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--studio-accent)] px-4 text-xs font-bold text-[#141518]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Launch Prompt Generator</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <StudioImage
              src={STUDIO_IMAGES.productStudio}
              alt="Precision 35mm camera lens and brass shutter release on slate"
              className="h-56 w-full object-cover md:h-full"
              fallbackTitle="LensCraft AI Optical Engineering"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="neo-card-flat p-5">
          <Cpu className="h-5 w-5 text-[var(--studio-accent)]" />
          <h3 className="mt-3 font-display text-base font-bold text-[var(--studio-ink)]">
            100% Local Browser Engine
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
            Zero external AI APIs, zero API keys, and zero server dependencies. Prompt assembly, negative prompt adaptation, and rule-based enhancement all execute locally in JavaScript.
          </p>
        </div>

        <div className="neo-card-flat p-5">
          <Aperture className="h-5 w-5 text-[var(--studio-accent)]" />
          <h3 className="mt-3 font-display text-base font-bold text-[var(--studio-ink)]">
            Smart Compatibility Guidance
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
            Rule-based optical diagnostics warn you when settings clash—such as Macro Photography on a 16mm wide lens or f/16 paired with Ultra Shallow Bokeh—while letting you override freely.
          </p>
        </div>

        <div className="neo-card-flat p-5">
          <Globe2 className="h-5 w-5 text-[var(--studio-accent)]" />
          <h3 className="mt-3 font-display text-base font-bold text-[var(--studio-ink)]">
            Bilingual English & Indonesian
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
            Switch between English and Indonesian anytime. Both Natural Language prose and Structured Breakdown outputs, plus adaptive Negative Prompts, translate cleanly.
          </p>
        </div>

        <div className="neo-card-flat p-5">
          <ShieldCheck className="h-5 w-5 text-[var(--studio-accent)]" />
          <h3 className="mt-3 font-display text-base font-bold text-[var(--studio-ink)]">
            Offline Favorites & Exports
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--studio-ink-muted)]">
            Save favorites and prompt history to browser localStorage, and export complete prompt configurations as portable TXT or JSON files.
          </p>
        </div>
      </section>
    </div>
  );
};
