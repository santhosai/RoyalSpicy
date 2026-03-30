'use client';

import { usePOS } from '@/context/POSContext';

export function ToastContainer() {
  const { toasts } = usePOS();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`
            px-4 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg
            animate-[slideUp_0.3s_ease]
            ${t.type === 'error' ? 'bg-danger' : 'bg-success'}
          `}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
