import type { ToastEmits, ToastProps } from '../types';
import type { EmitsToProps } from '../types/type.utils';
import { useState } from '#imports';
import { nextTick, ref } from 'vue';

export interface Toast extends Omit<ToastProps, 'defaultOpen'>, EmitsToProps<ToastEmits> {
  id: string | number;
  onClick?: (toast: Toast) => void;
}

export function useToast() {
  const toasts = useState<Array<Toast>>('toasts', () => []);
  const maxToasts = 5;
  const running = ref(false);
  const queue: Array<Toast> = [];

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  async function processQueue() {
    if (running.value || queue.length === 0) {
      return;
    }

    running.value = true;

    while (queue.length > 0) {
      const toast = queue.shift()!;

      // eslint-disable-next-line no-await-in-loop
      await nextTick();

      toasts.value = [...toasts.value, toast].slice(-maxToasts);
    }

    running.value = false;
  }

  function add(toast: Partial<Toast>): Toast {
    const body = {
      id: generateId(),
      open: true,
      ...toast,
    } as Toast;

    queue.push(body);

    processQueue();

    return body;
  }

  function update(id: string | number, toast: Omit<Partial<Toast>, 'id'>) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id);
    if (index !== -1) {
      toasts.value[index] = {
        ...toasts.value[index] as Toast,
        ...toast,
      };
    }
  }

  function remove(id: string | number) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id);
    if (index !== -1) {
      toasts.value[index] = {
        ...toasts.value[index] as Toast,
        open: false,
      };
    }

    setTimeout(() => {
      toasts.value = toasts.value.filter((t: Toast) => t.id !== id);
    }, 200);
  }

  function clear() {
    toasts.value = [];
  }

  return {
    toasts,
    add,
    update,
    remove,
    clear,
  };
}
