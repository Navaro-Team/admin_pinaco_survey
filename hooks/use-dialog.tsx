"use client"

import { useDialogContext } from '@/context/DialogContext'
export type { DialogType, DialogConfig } from '@/context/DialogContext'

export const useDialog = () => {
  const { open, close, showSuccess, showFailed, showWarning, showInfo, showLoading, state } = useDialogContext()

  return {
    showDialog: open,
    showSuccess,
    showFailed,
    showWarning,
    showInfo,
    showLoading,
    hideDialog: close
  }
} 