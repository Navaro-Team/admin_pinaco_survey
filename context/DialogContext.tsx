'use client';

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export type DialogType = 'success' | 'failed' | 'warning' | 'info' | 'custom';

export interface DialogConfig {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  actions?: ReactNode;
}

export interface DialogVisualConfig {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

export interface DialogState extends DialogConfig {
  isOpen: boolean;
  type: DialogType;
}

interface DialogContextType {
  state: DialogState;
  open: (type: DialogType, config: DialogConfig) => void;
  close: () => void;
  showSuccess: (config: DialogConfig) => void;
  showFailed: (config: DialogConfig) => void;
  showWarning: (config: DialogConfig) => void;
  showInfo: (config: DialogConfig) => void;
  visuals: Record<DialogType, DialogVisualConfig>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialogContext = (): DialogContextType => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialogContext must be used within a DialogProvider');
  return ctx;
};

const visuals: Record<DialogType, DialogVisualConfig> = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  failed: {
    icon: XCircle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  custom: {
    icon: Info,
    iconColor: 'text-muted-foreground',
    bgColor: '',
    borderColor: '',
  },
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    type: 'info',
    title: '',
    description: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  const open = useCallback((type: DialogType, config: DialogConfig) => {
    setState({
      isOpen: true,
      type,
      title: config.title,
      description: config.description,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
      actions: config.actions,
    });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback((config: DialogConfig) => open('success', config), [open]);
  const showFailed = useCallback((config: DialogConfig) => open('failed', config), [open]);
  const showWarning = useCallback((config: DialogConfig) => open('warning', config), [open]);
  const showInfo = useCallback((config: DialogConfig) => open('info', config), [open]);

  const value = useMemo<DialogContextType>(() => ({
    state,
    open,
    close,
    showSuccess,
    showFailed,
    showWarning,
    showInfo,
    visuals,
  }), [state, open, close, showSuccess, showFailed, showWarning, showInfo]);

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};