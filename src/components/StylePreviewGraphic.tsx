import React from 'react';
import { PhotographyStyleItem } from '../types/photography';

interface StylePreviewGraphicProps {
  style: PhotographyStyleItem;
  className?: string;
}

export const StylePreviewGraphic: React.FC<StylePreviewGraphicProps> = ({ style, className = '' }) => {
  const [c1, c2, c3] = style.palette;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-black/15 dark:border-white/10 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${c3} 0%, ${c2} 55%, ${c1} 100%)`,
      }}
      aria-hidden="true"
    >
      {/* Viewfinder Optical Grid */}
      <svg
        viewBox="0 0 160 96"
        className="h-full w-full block"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`glow-${style.id.replace(/\s+/g, '-')}`} cx="65%" cy="35%" r="60%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.45" />
            <stop offset="100%" stopColor={c3} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <rect
          width="160"
          height="96"
          fill={`url(#glow-${style.id.replace(/\s+/g, '-')})`}
        />

        {/* Motif geometry */}
        {style.previewMotif === 'portrait' && (
          <g stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.2">
            <circle cx="80" cy="36" r="14" fill="rgba(255,255,255,0.12)" />
            <path d="M52 84 C52 62, 108 62, 108 84" fill="rgba(255,255,255,0.08)" />
            <circle cx="80" cy="48" r="34" strokeDasharray="3 3" strokeOpacity="0.4" />
          </g>
        )}

        {style.previewMotif === 'street' && (
          <g stroke="rgba(255,255,255,0.45)" fill="none" strokeWidth="1.2">
            <line x1="16" y1="88" x2="72" y2="42" />
            <line x1="144" y1="88" x2="88" y2="42" />
            <rect x="26" y="20" width="24" height="50" strokeOpacity="0.4" />
            <rect x="110" y="16" width="24" height="54" strokeOpacity="0.4" />
            <circle cx="80" cy="54" r="5" fill="rgba(255,255,255,0.45)" />
          </g>
        )}

        {style.previewMotif === 'cinema' && (
          <g stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1.2">
            <rect x="10" y="20" width="140" height="56" strokeOpacity="0.65" />
            <line x1="10" y1="38" x2="150" y2="38" strokeOpacity="0.25" />
            <line x1="10" y1="58" x2="150" y2="58" strokeOpacity="0.25" />
            <circle cx="58" cy="48" r="10" fill="rgba(255,255,255,0.18)" />
            <circle cx="110" cy="48" r="4" fill="rgba(255,255,255,0.5)" />
          </g>
        )}

        {style.previewMotif === 'macro' && (
          <g stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1.2">
            <circle cx="80" cy="48" r="26" strokeDasharray="2 2" />
            <circle cx="80" cy="48" r="14" fill="rgba(255,255,255,0.18)" />
            <circle cx="106" cy="34" r="6" fill="rgba(255,255,255,0.28)" />
            <circle cx="54" cy="62" r="4" fill="rgba(255,255,255,0.2)" />
          </g>
        )}

        {style.previewMotif === 'product' && (
          <g stroke="rgba(255,255,255,0.55)" fill="none" strokeWidth="1.2">
            <rect x="62" y="24" width="36" height="44" rx="4" fill="rgba(255,255,255,0.14)" />
            <line x1="32" y1="72" x2="128" y2="72" strokeOpacity="0.6" />
            <path d="M40 20 L62 42" strokeOpacity="0.35" strokeDasharray="2 2" />
          </g>
        )}

        {style.previewMotif === 'architecture' && (
          <g stroke="rgba(255,255,255,0.55)" fill="none" strokeWidth="1.2">
            <rect x="36" y="18" width="44" height="64" fill="rgba(255,255,255,0.08)" />
            <rect x="80" y="30" width="44" height="52" fill="rgba(255,255,255,0.14)" />
            <line x1="48" y1="18" x2="48" y2="82" strokeOpacity="0.4" />
            <line x1="60" y1="18" x2="60" y2="82" strokeOpacity="0.4" />
          </g>
        )}

        {style.previewMotif === 'landscape' && (
          <g stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1.2">
            <path d="M10 74 L48 36 L80 62 L114 28 L150 74 Z" fill="rgba(255,255,255,0.12)" />
            <circle cx="122" cy="24" r="7" fill="rgba(255,255,255,0.35)" />
          </g>
        )}

        {style.previewMotif === 'food' && (
          <g stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1.2">
            <circle cx="80" cy="48" r="24" fill="rgba(255,255,255,0.12)" />
            <circle cx="80" cy="48" r="15" strokeOpacity="0.6" />
            <circle cx="76" cy="45" r="5" fill="rgba(255,255,255,0.35)" />
          </g>
        )}

        {style.previewMotif === 'sports' && (
          <g stroke="rgba(255,255,255,0.55)" fill="none" strokeWidth="1.3">
            <line x1="22" y1="68" x2="128" y2="26" />
            <line x1="36" y1="76" x2="138" y2="36" strokeOpacity="0.45" />
            <circle cx="104" cy="36" r="10" fill="rgba(255,255,255,0.22)" />
          </g>
        )}

        {style.previewMotif === 'film' && (
          <g stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="1.2">
            <rect x="20" y="14" width="120" height="68" rx="2" />
            <line x1="73" y1="14" x2="73" y2="82" strokeOpacity="0.25" />
            <line x1="20" y1="48" x2="140" y2="48" strokeOpacity="0.25" />
            <circle cx="80" cy="48" r="18" fill="rgba(255,255,255,0.14)" />
          </g>
        )}

        {/* Corner viewfinder ticks */}
        <path
          d="M10 18 L10 10 L18 10 M142 10 L150 10 L150 18 M10 78 L10 86 L18 86 M142 86 L150 86 L150 78"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="1.4"
          fill="none"
        />
      </svg>

      {/* Bottom palette & optical hint */}
      <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
        <span className="h-2.5 w-2.5 rounded-full border border-white/40" style={{ backgroundColor: c1 }} />
        <span className="h-2.5 w-2.5 rounded-full border border-white/40" style={{ backgroundColor: c2 }} />
        <span className="h-2.5 w-2.5 rounded-full border border-white/40" style={{ backgroundColor: c3 }} />
      </div>
    </div>
  );
};
