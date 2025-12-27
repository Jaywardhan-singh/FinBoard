import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface WidgetHeaderProps {
  title: string;
  refreshInterval: number;
  onRefresh?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  refreshInterval,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-dark-700 dark:border-dark-700 border-gray-200 transition-colors">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">{title}</h3>
        <Badge variant="secondary" size="sm">
          {refreshInterval}s
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh(e);
            }}
            className="p-2 text-dark-400 dark:text-dark-400 text-gray-500 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-dark-800 dark:hover:bg-dark-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
            className="p-2 text-dark-400 dark:text-dark-400 text-gray-500 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-dark-800 dark:hover:bg-dark-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="p-2 text-dark-400 dark:text-dark-400 text-gray-500 hover:text-red-400 dark:hover:text-red-400 hover:bg-dark-800 dark:hover:bg-dark-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
