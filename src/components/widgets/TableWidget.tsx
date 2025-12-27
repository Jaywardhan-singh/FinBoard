'use client';

import React, { useState, useMemo } from 'react';
import { getValueByPath } from '@/utils/jsonExplorer';
import { formatValue } from '@/utils/formatter';
import { formatTimestamp } from '@/utils/helpers';
import { Input } from '@/components/ui/Input';

interface TableWidgetProps {
  data: any;
  selectedFields: string[];
  lastUpdated?: number;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const TableWidget: React.FC<TableWidgetProps> = ({
  data,
  selectedFields,
  lastUpdated,
}) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const tableData = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    const firstArrayField = selectedFields.find((field) => {
      const value = getValueByPath(data, field);
      return Array.isArray(value);
    });

    if (firstArrayField) {
      return getValueByPath(data, firstArrayField) || [];
    }

    return [data];
  }, [data, selectedFields]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return tableData;

    const searchLower = search.toLowerCase();
    return tableData.filter((row: any) => {
      return selectedFields.some((field) => {
        const value = getValueByPath(row, field);
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [tableData, search, selectedFields]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getValueByPath(a, sortConfig.key);
      const bValue = getValueByPath(b, sortConfig.key);

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return '↑↓';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (!data) {
    return (
      <div className="text-center text-dark-500 dark:text-dark-500 text-gray-500 py-8 transition-colors">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="🔍 Search table..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-xs"
        />
        <div className="text-sm text-dark-400 dark:text-dark-400 text-gray-600 transition-colors">
          {filteredData.length} of {tableData.length} items
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-dark-700 dark:border-dark-700 border-gray-200 transition-colors">
              {selectedFields.map((field) => {
                const displayName = field.split('.').pop() || field;
                return (
                  <th
                    key={field}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-dark-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => handleSort(field)}
                  >
                    {displayName} {getSortIcon(field)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={selectedFields.length}
                  className="px-4 py-8 text-center text-dark-500 dark:text-dark-500 text-gray-500 transition-colors"
                >
                  No data found
                </td>
              </tr>
            ) : (
              sortedData.map((row: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-dark-800 dark:border-dark-800 border-gray-100 hover:bg-dark-900 dark:hover:bg-dark-900 hover:bg-gray-50 transition-colors"
                >
                  {selectedFields.map((field) => {
                    const value = getValueByPath(row, field);
                    return (
                      <td key={field} className="px-4 py-3 text-sm text-gray-900 dark:text-white transition-colors">
                        {formatValue(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {lastUpdated && (
        <div className="text-xs text-dark-500 dark:text-dark-500 text-gray-500 text-center transition-colors">
          Last updated: {formatTimestamp(lastUpdated)}
        </div>
      )}
    </div>
  );
};
