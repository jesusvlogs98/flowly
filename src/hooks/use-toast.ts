import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notify(listeners: typeof toastListeners, newToasts: Toast[]) {
  listeners.forEach((l) => l(newToasts));
}

export function toast(props: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { ...props, id }];
  notify(toastListeners, toasts);
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify(toastListeners, toasts);
  }, 3000);
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts);
  const subscribe = useCallback(() => {
    toastListeners.push(setLocalToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setLocalToasts);
    };
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return { toasts: localToasts, toast };
}
