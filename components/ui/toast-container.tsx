'use client';

import React from 'react';
import { ToastComponent } from './toast';
import { useToastContext } from '@/context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-right-full duration-300"
        >
          <ToastComponent
            toast={toast}
            onRemove={removeToast}
          />
        </div>
      ))}
    </div>
  );
}; 