'use client';

import React, { useEffect, useRef } from 'react';
import { Widget } from '@/store/dashboardStore';
import { apiClient } from '@/services/apiClient';
import { realtimeService } from '@/services/realtimeService';
import { useDashboardStore } from '@/store/dashboardStore';
import { WidgetCard } from './WidgetCard';

interface WidgetWrapperProps {
  widget: Widget;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  widget,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const { updateWidgetData } = useDashboardStore();
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (isSubscribedRef.current) return;
    isSubscribedRef.current = true;

    const handleUpdate = (data: any, error?: string) => {
      updateWidgetData(widget.id, data, error);
    };

    realtimeService.subscribe(
      {
        widgetId: widget.id,
        apiUrl: widget.apiUrl,
        updateInterval: widget.refreshInterval,
        useWebSocket: widget.useWebSocket || false,
        wsUrl: widget.wsUrl,
      },
      handleUpdate
    );

    return () => {
      realtimeService.unsubscribe(widget.id);
      isSubscribedRef.current = false;
    };
  }, [widget.id, widget.apiUrl, widget.refreshInterval, updateWidgetData]);

  const handleRefresh = () => {
    apiClient.clearCacheForUrl(widget.apiUrl);
    realtimeService.manualRefresh(widget.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleRefresh();
  };

  return (
    <WidgetCard
      widget={widget}
      onRefresh={handleRefreshClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
