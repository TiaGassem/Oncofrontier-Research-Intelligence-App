// Color-vision-safe chart palette, read from CSS variables so the
// high-contrast theme can override the values. Every chart consumer must
// pair color with a non-color distinction (labels, shapes, or annotations).

export const CHART_SERIES_KEYS = ['1', '2', '3', '4', '5', '6'] as const;
export type ChartSeriesKey = (typeof CHART_SERIES_KEYS)[number];

export function chartColor(key: ChartSeriesKey): string {
  if (typeof window === 'undefined') return '#537aa0';
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--chart-${key}`).trim();
  return v || '#537aa0';
}

export function chartColors(): string[] {
  return CHART_SERIES_KEYS.map((k) => chartColor(k));
}

// Distinct marker shapes for series distinction without color (for SVG charts)
export const CHART_MARKERS: Array<'circle' | 'square' | 'triangle' | 'diamond'> = [
  'circle', 'square', 'triangle', 'diamond', 'circle', 'square',
];
