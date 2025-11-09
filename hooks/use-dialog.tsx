"use client"

import { useDialogContext } from '@/context/DialogContext'
export type { DialogType, DialogConfig } from '@/context/DialogContext'

export const useDialog = () => {
  const { open, close, showSuccess, showFailed, showWarning, showInfo, state } = useDialogContext()

  return {
    showDialog: open,
    showSuccess,
    showFailed,
    showWarning,
    showInfo,
    hideDialog: close,
    isOpen: state.isOpen,
  }
} 