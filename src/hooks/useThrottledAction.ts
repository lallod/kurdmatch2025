import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Returns a throttled version of the given async action.
 * Prevents rapid repeated calls within the cooldown window.
 */
export function useThrottledAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  cooldownMs: number = 1000,
  warningMessage?: string
): T {
  const lastCallRef = useRef(0);
  const pendingRef = useRef(false);

  return useCallback(
    (async (...args: any[]) => {
      const now = Date.now();
      if (pendingRef.current || now - lastCallRef.current < cooldownMs) {
        if (warningMessage) toast.info(warningMessage);
        return;
      }
      pendingRef.current = true;
      lastCallRef.current = now;
      try {
        return await action(...args);
      } finally {
        pendingRef.current = false;
      }
    }) as T,
    [action, cooldownMs, warningMessage]
  );
}
