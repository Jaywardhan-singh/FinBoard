'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getValueByPath } from '@/utils/jsonExplorer';
import { formatTimestamp } from '@/utils/helpers';

interface ChartWidgetProps {
  data: any;
  selectedFields: string[];
  chartType?: 'line' | 'candle';
  lastUpdated?: number;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  data,
  selectedFields,
  chartType = 'line',
  lastUpdated,
}) => {
  const chartData = useMemo(() => {
    if (!data) return [];

    let dataArray: any[] = [];

    if (Array.isArray(data)) {
      dataArray = data;
    } else {
      const firstArrayField = selectedFields.find((field) => {
        const value = getValueByPath(data, field);
        return Array.isArray(value);
      });

      if (firstArrayField) {
        dataArray = getValueByPath(data, firstArrayField) || [];
      } else {
        dataArray = [data];
      }
    }

    if (dataArray.length === 0) return [];

    const firstItem = dataArray[0];
    const numericFields = selectedFields.filter((field) => {
      const value = getValueByPath(firstItem, field);
      return typeof value === 'number';
    });

    if (numericFields.length === 0) return [];

    return dataArray.map((item, index) => {
      const chartPoint: any = {
        index,
        name: `Point ${index + 1}`,
      };

      numericFields.forEach((field) => {
        const value = getValueByPath(item, field);
        const fieldName = field.split('.').pop() || field;
        chartPoint[fieldName] = value;
      });

      const timeField = selectedFields.find((field) => {
        const value = getValueByPath(item, field);
        return typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}/);
      });

      if (timeField) {
        chartPoint.name = getValueByPath(item, timeField) || chartPoint.name;
      }

      return chartPoint;
    });
  }, [data, selectedFields]);

  if (!data || chartData.length === 0) {
    return (
      <div className="text-center text-dark-500 dark:text-dark-500 text-gray-500 py-8 transition-colors">
        No chart data available. Select numeric fields to display.
      </div>
    );
  }

  const numericFields = selectedFields.filter((field) => {
    if (chartData.length === 0) return false;
    const value = getValueByPath(chartData[0], field);
    return typeof value === 'number';
  });

  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-4">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            {numericFields.map((field, index) => {
              const fieldName = field.split('.').pop() || field;
              return (
                <Line
                  key={field}
                  type="monotone"
                  dataKey={fieldName}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {lastUpdated && (
        <div className="text-xs text-dark-500 dark:text-dark-500 text-gray-500 text-center transition-colors">
          Last updated: {formatTimestamp(lastUpdated)}
        </div>
      )}
    </div>
  );
};
