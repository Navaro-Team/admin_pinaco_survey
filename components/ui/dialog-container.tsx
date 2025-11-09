'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDialogContext } from '@/context/DialogContext';
import { cn } from '@/lib/utils';
import type { DialogType } from '@/context/DialogContext';

const TYPE_TITLE: Record<DialogType, string> = {
  success: 'Success',
  failed: 'Failed',
  warning: 'Warning',
  info: 'Information',
  custom: '',
};

export const DialogContainer: React.FC = () => {
  const { state, close, visuals } = useDialogContext();

  if (!state.isOpen) return null;

  const visual = visuals[state.type];
  const Icon = visual.icon;

  const handleConfirm = () => {
    state.onConfirm?.();
    close();
  };

  const handleCancel = () => {
    state.onCancel?.();
    close();
  };

  const isCustom = state.type === 'custom';

  return (
    <AlertDialog open={state.isOpen} onOpenChange={close}>
      <AlertDialogContent>
        {/* Header: only for non-custom types */}
        {!isCustom && (
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <Icon className={cn('h-6 w-6', visual.iconColor)} />
              <span className={cn('text-base font-semibold', visual.iconColor)}>
                {TYPE_TITLE[state.type]}
              </span>
            </div>
          </AlertDialogHeader>
        )}

        {/* Body: user-provided title + description */}
        <div className="space-y-2">
          {state.title && (
            <AlertDialogTitle className="text-center">{state.title}</AlertDialogTitle>
          )}
          {state.description && (
            <AlertDialogDescription className="text-center">
              {state.description}
            </AlertDialogDescription>
          )}
        </div>

        {/* Actions: if custom actions provided, render them instead of default footer */}
        {state.actions ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {state.actions}
          </div>
        ) : (
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};