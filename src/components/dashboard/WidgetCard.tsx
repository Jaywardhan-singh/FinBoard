'use client';

import React from 'react';
import { Widget } from '@/store/dashboardStore';
import { WidgetHeader } from './WidgetHeader';
import { CardWidget } from '@/components/widgets/CardWidget';
import { TableWidget } from '@/components/widgets/TableWidget';
import { ChartWidget } from '@/components/widgets/ChartWidget';
import { Loader } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';

interface WidgetCardProps {
  widget: Widget;
  onRefresh: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  const renderWidgetContent = () => {
    if (widget.error) {
      return (
        <div className="p-4 text-center">
          <Badge variant="danger" size="md" className="mb-2">
            Error !!!
          </Badge>
          <p className="text-sm text-red-400 dark:text-red-400 text-red-600 transition-colors">{widget.error}</p>
        </div>
      );
    }

    if (!widget.data) {
      return (
        <div className="p-8 flex items-center justify-center">
          <Loader size="md" />
        </div>
      );
    }

    switch (widget.type) {
      case 'card':
        return (
          <CardWidget
            data={widget.data}
            selectedFields={widget.selectedFields}
            lastUpdated={widget.lastUpdated}
          />
        );
      case 'table':
        return (
          <TableWidget
            data={widget.data}
            selectedFields={widget.selectedFields}
            lastUpdated={widget.lastUpdated}
          />
        );
      case 'chart':
        return (
          <ChartWidget
            data={widget.data}
            selectedFields={widget.selectedFields}
            chartType={widget.chartType}
            lastUpdated={widget.lastUpdated}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-dark-800 dark:bg-dark-800 bg-white rounded-xl border border-dark-700 dark:border-dark-700 border-gray-200 shadow-lg overflow-hidden flex flex-col h-full transition-colors">
      <div data-no-drag="true">
        <WidgetHeader
          title={widget.title}
          refreshInterval={widget.refreshInterval}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <div className="p-4 flex-1 overflow-auto">{renderWidgetContent()}</div>
    </div>
  );
};
