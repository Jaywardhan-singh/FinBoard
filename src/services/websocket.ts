type MessageHandler = (data: any) => void;
type ErrorHandler = (error: Event) => void;

interface WebSocketConfig {
  url: string;
  onMessage?: MessageHandler;
  onError?: ErrorHandler;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: Required<Omit<WebSocketConfig, 'onMessage' | 'onError' | 'onOpen' | 'onClose'>> & {
    onMessage?: MessageHandler;
    onError?: ErrorHandler;
    onOpen?: () => void;
    onClose?: () => void;
  };
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManualClose = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      reconnectInterval: config.reconnectInterval ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
      onMessage: config.onMessage,
      onError: config.onError,
      onOpen: config.onOpen,
      onClose: config.onClose,
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.config.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.config.onMessage?.(data);
        } catch (error) {
          this.config.onMessage?.(event.data);
        }
      };

      this.ws.onerror = (error) => {
        this.config.onError?.(error);
      };

      this.ws.onclose = () => {
        this.config.onClose?.();
        if (!this.isManualClose && this.reconnectAttempts < this.config.maxReconnectAttempts) {
          this.reconnect();
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      if (!this.isManualClose) {
        this.reconnect();
      }
    }
  }

  private reconnect(): void {
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect(): void {
    this.isManualClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const createWebSocketConnection = (
  url: string,
  onMessage: MessageHandler,
  options?: Partial<WebSocketConfig>
): WebSocketClient => {
  const client = new WebSocketClient({
    url,
    onMessage,
    ...options,
  });
  client.connect();
  return client;
};
