import { useState, useCallback, useEffect } from "react";

export interface Toast {
  id: string;
  title: string;
  body: string;
  type: "success" | "error" | "info" | "warning";
  emoji?: string;
  duration?: number;
}

/**
 * Custom hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      title: string,
      body: string,
      type: "success" | "error" | "info" | "warning" = "info",
      emoji?: string,
      duration = 4000,
    ) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, title, body, type, emoji, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);

        return () => clearTimeout(timer);
      }
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
}
