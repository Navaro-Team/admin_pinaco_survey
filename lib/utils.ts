import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ReasonCodeKey } from "./types"
import { reasonCode } from "./consts"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const deepCloneObject = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
}
export function getErrorMessage(code: ReasonCodeKey): string {
  return reasonCode[code];
}

export function isAppleBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;

  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  return isIOS || isSafari;
}