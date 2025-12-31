'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDialogContext } from '@/context/DialogContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

  const showButtons = state.type !== 'loading';
  const showBothButtons = ['success', 'info'].includes(state.type);
  const showCloseOnly = ['warning', 'failed'].includes(state.type);

  return (
    <AlertDialog open={state.isOpen} onOpenChange={close}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-2">
            {state.type === 'loading' ? (
              <Icon className={cn('h-12 w-12', visual.iconColor)} />
            ) : (
              <Icon className={cn('h-12 w-12', visual.iconColor)} />
            )}
            {state.title && (
              <AlertDialogTitle className="text-center text-lg font-semibold">{state.title}</AlertDialogTitle>
            )}
          </div>
        </AlertDialogHeader>

        {state.description && (
          <AlertDialogDescription className="text-center text-sm text-gray-700">
            {state.description}
          </AlertDialogDescription>
        )}

        {/* Actions */}
        {showButtons && (
          <AlertDialogFooter className="sm:justify-end gap-2">
            {showCloseOnly && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                {state.cancelText || 'Đóng'}
              </Button>
            )}
            {showBothButtons && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  {state.cancelText || 'Đóng'}
                </Button>
                <Button
                  variant="default"
                  onClick={handleConfirm}
                  className="w-full sm:w-auto bg-main text-white hover:bg-main/90"
                >
                  {state.confirmText || 'Xác nhận'}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};