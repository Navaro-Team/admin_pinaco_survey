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
  success: 'Thành công',
  failed: 'Thất bại',
  warning: 'Cảnh báo',
  info: 'Thông tin',
  loading: 'Đang xử lý',
  custom: '',
};

export const DialogContainer: React.FC = () => {
  const { state, close, visuals, } = useDialogContext();

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
  const isLoading = state.type === 'loading';
  const showDefaultFooter = !isLoading || state.actions;

  return (
    <AlertDialog open={state.isOpen} onOpenChange={close}>
      <AlertDialogContent>
        {/* Header: only for non-custom types */}
        {!isCustom && (
          <AlertDialogHeader>
            {isLoading ? (
              <div className="flex justify-center py-1">
                <Icon className={cn('h-10 w-10 shrink-0', visual.iconColor)} aria-hidden />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Icon className={cn('h-6 w-6 shrink-0', visual.iconColor)} />
                <span
                  className={cn('text-base font-semibold', visual.iconColor)}
                  aria-hidden
                >
                  {TYPE_TITLE[state.type]}
                </span>
              </div>
            )}
          </AlertDialogHeader>
        )}

        {/* Body: Radix requires AlertDialogTitle; sr-only when no visible title */}
        <div className="space-y-2">
          {state.title && !isLoading ? (
            <AlertDialogTitle className="text-center">{state.title}</AlertDialogTitle>
          ) : (
            <AlertDialogTitle className="sr-only">
              {isLoading
                ? TYPE_TITLE.loading
                : isCustom
                  ? 'Thông báo'
                  : TYPE_TITLE[state.type]}
            </AlertDialogTitle>
          )}
          {state.description && (
            <AlertDialogDescription className="text-center">
              {state.description}
            </AlertDialogDescription>
          )}
          {state.content && <>
            <AlertDialogDescription></AlertDialogDescription>
            <div aria-describedby="content">{state.content}</div>
          </>}
        </div>

        {/* Actions: if custom actions provided, render them instead of default footer */}
        {state.actions ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {state.actions}
          </div>
        ) : showDefaultFooter ? (
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className='bg-main hover:bg-main/90'>
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
};