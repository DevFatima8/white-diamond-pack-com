'use client';

import { useLanguage } from '@/context/LanguageContext';

/**
 * Simplified map of Pakistan with delivery routes from Faisalabad.
 * The outline and city positions come from real longitude/latitude, projected onto
 * the SVG (x = (lon − 60.5) × 26, y = (37.4 − lat) × 30) — accurate enough to be
 * recognisable, light enough to inline. Decorative: described by a text label.
 */
const OUTLINE =
  'M42.6 379 L60.8 377.5 L92 376 L120.6 376 L144 370 L172.6 370 L183 388 L193.4 406 L206.4 415 L227.2 421 L248 406 L274 403 L289.6 400 L276.6 361 L266.2 337 L261 322 L276.6 298 L310.4 289 L336.4 262 L349.4 235 L365 214 L380.6 199 L378 175 L398.8 163 L380.6 148 L372.8 130 L365 115 L362.4 94 L404 82 L443 67 L463.8 67 L443 52 L417 34 L401.4 25 L378 22 L339 25 L302.6 31 L292.2 52 L302.6 73 L289.6 94 L287 109 L268.8 115 L258.4 124 L266.2 133 L248 142 L240.2 160 L242.8 175 L224.6 178 L203.8 187 L183 193 L172.6 205 L164.8 235 L118 244 L92 247 L66 250 L24.4 235 L42.6 268 L63.4 283 L73.8 313 L86.8 331 L53 340 L47.8 358 Z';

const HUB = { x: 341.1, y: 189.4 }; // Faisalabad

type CityKey = 'lahore' | 'islamabad' | 'peshawar' | 'multan' | 'karachi';
// label side: where the text sits relative to the pin (in screen terms, not reading order)
const CITIES: { key: CityKey; x: number; y: number; side: 'left' | 'right'; port?: boolean }[] = [
  { key: 'lahore', x: 374.1, y: 185.5, side: 'right' },
  { key: 'islamabad', x: 340.3, y: 121.6, side: 'right' },
  { key: 'peshawar', x: 302.1, y: 112, side: 'left' },
  { key: 'multan', x: 299.2, y: 226, side: 'left' },
  { key: 'karachi', x: 183, y: 386.2, side: 'right', port: true },
];

export default function PakistanMap() {
  const { t, isRTL } = useLanguage();
  const tm = t.home.presence;

  // In RTL, SVG "start" means the right edge, so swap anchors to keep labels on the same side.
  const anchor = (side: 'left' | 'right') => (side === 'right' ? (isRTL ? 'end' : 'start') : isRTL ? 'start' : 'end');

  return (
    <svg viewBox="0 0 490 440" className="h-auto w-full max-w-[460px]" role="img" aria-label={tm.mapAlt} direction={isRTL ? 'rtl' : 'ltr'}>
      <path d={OUTLINE} fill="rgba(139, 20, 20, 0.06)" stroke="rgba(139, 20, 20, 0.35)" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="4 3" />

      {CITIES.map((c) => (
        <line key={`l-${c.key}`} x1={HUB.x} y1={HUB.y} x2={c.x} y2={c.y} stroke="#D98A8F" strokeWidth="2" strokeDasharray="5 3" />
      ))}

      {CITIES.map((c) => (
        <g key={c.key}>
          <circle cx={c.x} cy={c.y} r={c.port ? 6 : 5} fill={c.port ? '#C1121F' : '#8B1414'} stroke="#FFFFFF" strokeWidth="2" />
          <text
            x={c.x + (c.side === 'right' ? 10 : -10)}
            y={c.y + 4}
            textAnchor={anchor(c.side)}
            fill="#1A1212"
            fontSize="13"
            fontWeight={c.port ? 700 : 500}
            style={{ fontFamily: 'var(--font-sans), var(--font-arabic), sans-serif' }}
          >
            {tm.mapCities[c.key]}
          </text>
        </g>
      ))}

      {/* Faisalabad hub: pulsing ring + pin */}
      <circle cx={HUB.x} cy={HUB.y} r="16" fill="#C1121F" opacity="0.25" className="origin-center animate-ping [transform-box:fill-box]" />
      <circle cx={HUB.x} cy={HUB.y} r="8" fill="#C1121F" stroke="#FFFFFF" strokeWidth="3" />
      {/* below-right of the pin: left is taken by Multan, right by Lahore */}
      <text
        x={HUB.x + 6}
        y={HUB.y + 28}
        textAnchor={anchor('right')}
        fill="#1A1212"
        fontSize="13"
        fontWeight="700"
        style={{ fontFamily: 'var(--font-heading), var(--font-arabic), sans-serif' }}
      >
        {tm.mapCities.faisalabad}
      </text>
    </svg>
  );
}
