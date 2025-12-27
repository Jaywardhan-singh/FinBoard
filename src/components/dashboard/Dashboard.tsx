'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useThemeStore } from '@/store/themeStore';
import { WidgetGrid } from './WidgetGrid';
import { AddWidgetModal } from './AddWidgetModal';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const Dashboard: React.FC = () => {
  const {
    widgets,
    addWidget,
    removeWidget,
    reorderWidgets,
  } = useDashboardStore();

  const { theme } = useThemeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleAddWidget = (widgetData: {
    title: string;
    apiUrl: string;
    refreshInterval: number;
    type: 'card' | 'table' | 'chart';
    selectedFields: string[];
    wsUrl?: string;
    useWebSocket?: boolean;
  }) => {
    addWidget(widgetData);
  };

  const handleRefresh = (id: string) => {};

  const handleEdit = (id: string) => {
    setEditingWidgetId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to DELETE this widget ?')) {
      removeWidget(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 from-slate-50 via-slate-100 to-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3 transition-colors">
              <svg
                className="w-10 h-10 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Finance Dashboard
            </h1>
            <p className="text-gray-800 dark:text-dark-400 transition-colors">
              {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} • Real-time data
            </p>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <ThemeToggle />
            <Button onClick={() => setIsModalOpen(true)}>
              + Add Widget
            </Button>
          </div>
        </div>

        {widgets.length === 0 ? (
          <EmptyState onAddWidget={() => setIsModalOpen(true)} />
        ) : (
          <WidgetGrid
            widgets={widgets}
            onReorder={reorderWidgets}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <AddWidgetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWidgetId(null);
          }}
          onAdd={handleAddWidget}
        />
      </div>
    </div>
  );
};
