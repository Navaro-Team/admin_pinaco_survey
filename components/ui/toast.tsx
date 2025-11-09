import React from 'react';
import {  AlertDescription, AlertTitle } from './alert';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast } from '@/hooks/use-toast';

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastVariants = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

export const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const Icon = toastIcons[toast.type];

  return (
    <div
      className={cn(
        'relative w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        'transform translate-x-0 opacity-100',
        toastVariants[toast.type]
      )}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <AlertTitle className="font-medium text-sm">
            {toast.title}
          </AlertTitle>
          {toast.message && (
            <AlertDescription className="text-sm mt-1">
              {toast.message}
            </AlertDescription>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}; 