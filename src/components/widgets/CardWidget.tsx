'use client';

import React from 'react';
import { getValueByPath } from '@/utils/jsonExplorer';
import { formatValue } from '@/utils/formatter';
import { formatTimestamp } from '@/utils/helpers';

interface CardWidgetProps {
  data: any;
  selectedFields: string[];
  lastUpdated?: number;
}

export const CardWidget: React.FC<CardWidgetProps> = ({
  data,
  selectedFields,
  lastUpdated,
}) => {
  if (!data) {
    return (
      <div className="text-center text-dark-500 dark:text-dark-500 text-gray-500 py-8 transition-colors">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {selectedFields.map((field) => {
          const value = getValueByPath(data, field);
          const displayName = field.split('.').pop() || field;

          return (
            <div
              key={field}
              className="flex items-center justify-between p-3 bg-dark-900 dark:bg-dark-900 bg-gray-50 rounded-lg border border-dark-700 dark:border-dark-700 border-gray-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-dark-400 capitalize transition-colors">
                {displayName}
              </span>
              <span className="text-base font-semibold text-gray-900 dark:text-white transition-colors">
                {formatValue(value)}
              </span>
            </div>
          );
        })}
      </div>
      {lastUpdated && (
        <div className="text-xs text-dark-500 dark:text-dark-500 text-gray-500 text-center transition-colors">
          Last updated: {formatTimestamp(lastUpdated)}
        </div>
      )}
    </div>
  );
};
