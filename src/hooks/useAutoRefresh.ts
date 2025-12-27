import { useEffect, useRef, useCallback } from 'react';

export function useAutoRefresh(
  callback: () => void | Promise<void>,
  interval: number,
  enabled: boolean = true
): void {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || interval <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const execute = async () => {
      await callbackRef.current();
    };

    execute();

    intervalRef.current = setInterval(execute, interval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, enabled]);
}
