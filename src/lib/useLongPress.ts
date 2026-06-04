// Appui long (mobile) — IDENTIQUE sur toutes les PWA. Ouvre un menu d'actions
// (alternative tactile au clic droit / kebab desktop). delay 500ms, seuil 10px.
import { useCallback, useRef } from "react";

interface LongPressHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  /** À brancher sur onClick : true si le clic doit être ignoré (suit un long press). */
  shouldIgnoreClick: () => boolean;
}

export function useLongPress(
  callback: (e: React.PointerEvent) => void,
  { delay = 500, moveThreshold = 10 }: { delay?: number; moveThreshold?: number } = {},
): LongPressHandlers {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(
    (e: React.PointerEvent) => {
      triggeredRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      timeoutRef.current = setTimeout(() => {
        triggeredRef.current = true;
        callback(e);
      }, delay);
    },
    [callback, delay],
  );

  const move = useCallback(
    (e: React.PointerEvent) => {
      const s = startPosRef.current;
      if (!s) return;
      if (Math.abs(e.clientX - s.x) > moveThreshold || Math.abs(e.clientY - s.y) > moveThreshold) {
        cancel();
      }
    },
    [cancel, moveThreshold],
  );

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerMove: move,
    onPointerCancel: cancel,
    shouldIgnoreClick: () => triggeredRef.current,
  };
}
