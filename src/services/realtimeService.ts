import { createWebSocketConnection, WebSocketClient } from './websocket';
import { apiClient } from './apiClient';

interface RealtimeConfig {
  widgetId: string;
  apiUrl: string;
  updateInterval?: number;
  useWebSocket?: boolean;
  wsUrl?: string;
}

class RealtimeService {
  private connections = new Map<string, WebSocketClient | NodeJS.Timeout>();
  private updateCallbacks = new Map<string, () => void>();

  subscribe(config: RealtimeConfig, onUpdate: (data: any, error?: string) => void): void {
    const { widgetId, apiUrl, useWebSocket, wsUrl, updateInterval = 30 } = config;

    const fetchData = async () => {
      try {
        const result = await apiClient.fetch(apiUrl, false);
        if (result.success && result.data) {
          onUpdate(result.data);
        } else {
          onUpdate(null, result.error || 'Failed to fetch data');
        }
      } catch (error) {
        onUpdate(null, error instanceof Error ? error.message : 'Unknown error');
      }
    };

    if (useWebSocket && wsUrl) {
      const ws = createWebSocketConnection(
        wsUrl,
        (data) => {
          onUpdate(data);
        },
        {
          onError: () => {
            onUpdate(null, 'WebSocket connection error');
          },
          onClose: () => {
            this.unsubscribe(widgetId);
            setTimeout(() => {
              this.subscribe(config, onUpdate);
            }, 3000);
          },
        }
      );

      this.connections.set(widgetId, ws);
    } else {
      fetchData();
      const interval = setInterval(fetchData, updateInterval * 1000);
      this.connections.set(widgetId, interval);
    }

    this.updateCallbacks.set(widgetId, fetchData);
  }

  unsubscribe(widgetId: string): void {
    const connection = this.connections.get(widgetId);
    
    if (connection instanceof WebSocketClient) {
      connection.disconnect();
    } else if (connection) {
      clearInterval(connection);
    }

    this.connections.delete(widgetId);
    this.updateCallbacks.delete(widgetId);
  }

  manualRefresh(widgetId: string): void {
    const callback = this.updateCallbacks.get(widgetId);
    if (callback) {
      callback();
    }
  }

  unsubscribeAll(): void {
    this.connections.forEach((connection, widgetId) => {
      this.unsubscribe(widgetId);
    });
  }
}

export const realtimeService = new RealtimeService();
