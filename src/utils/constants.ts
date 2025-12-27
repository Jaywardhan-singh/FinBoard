export const STORAGE_KEYS = {
  DASHBOARD: 'finboard_dashboard',
  THEME: 'finboard_theme',
} as const;

export const DEFAULT_REFRESH_INTERVAL = 30;

export const DISPLAY_MODES = ['card', 'table', 'chart'] as const;
export type DisplayMode = typeof DISPLAY_MODES[number];

export const CHART_TYPES = ['line', 'candle'] as const;
export type ChartType = typeof CHART_TYPES[number];
