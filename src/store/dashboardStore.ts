import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, DisplayMode, ChartType } from '@/utils/constants';
import { generateId } from '@/utils/helpers';

export interface Widget {
  id: string;
  title: string;
  apiUrl: string;
  refreshInterval: number;
  type: DisplayMode;
  selectedFields: string[];
  chartType?: ChartType;
  lastUpdated?: number;
  data?: any;
  error?: string;
  wsUrl?: string;
  useWebSocket?: boolean;
}

interface DashboardState {
  widgets: Widget[];
  addWidget: (widget: Omit<Widget, 'id' | 'lastUpdated' | 'data' | 'error'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  updateWidgetData: (id: string, data: any, error?: string) => void;
  resetDashboard: () => void;
  loadFromStorage: () => void;
  persistToStorage: () => void;
}

const defaultWidgets: Widget[] = [];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,

      addWidget: (widget) => {
        const newWidget: Widget = {
          ...widget,
          id: generateId(),
          lastUpdated: Date.now(),
        };
        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }));
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        }));
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      reorderWidgets: (startIndex, endIndex) => {
        const widgets = [...get().widgets];
        const [removed] = widgets.splice(startIndex, 1);
        widgets.splice(endIndex, 0, removed);
        set({ widgets });
      },

      updateWidgetData: (id, data, error) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id
              ? {
                  ...w,
                  data,
                  error,
                  lastUpdated: Date.now(),
                }
              : w
          ),
        }));
      },

      resetDashboard: () => {
        set({ widgets: defaultWidgets });
      },

      loadFromStorage: () => {
        if (typeof window === 'undefined') return;
        try {
          const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.state?.widgets) {
              set({ widgets: parsed.state.widgets });
            }
          }
        } catch (error) {
          console.error('Error loading dashboard from storage:', error);
        }
      },

      persistToStorage: () => {
        if (typeof window === 'undefined') return;
        try {
          const state = get();
          localStorage.setItem(
            STORAGE_KEYS.DASHBOARD,
            JSON.stringify({ state: { widgets: state.widgets } })
          );
        } catch (error) {
          console.error('Error persisting dashboard to storage:', error);
        }
      },
    }),
    {
      name: STORAGE_KEYS.DASHBOARD,
    }
  )
);
