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

/**
 * Format UTC date string with format pattern (similar to date-fns formatDate)
 * 
 * This function formats a UTC date string using the same format patterns as date-fns.
 * It automatically handles UTC timezone conversion.
 * 
 * Supports common date-fns format tokens:
 * - yyyy: 4-digit year, yy: 2-digit year
 * - MM: 2-digit month, M: month (1-12)
 * - dd: 2-digit day, d: day (1-31)
 * - HH: 2-digit hour (00-23), H: hour (0-23)
 * - mm: 2-digit minute, m: minute (0-59)
 * - ss: 2-digit second, s: second (0-59)
 * 
 * @param utcDateString - ISO 8601 UTC date string (e.g., "2026-01-30T09:16:48.236Z")
 * @param formatPattern - Format pattern string (e.g., 'HH:mm', 'dd/MM/yyyy', 'dd/MM/yyyy HH:mm')
 * @returns Formatted date string according to the pattern
 * 
 */
export function formatUTCDate(utcDateString: string, formatPattern: string): string {
  const date = new Date(utcDateString);
  
  // Helper to pad numbers
  const pad = (n: number, length: number = 2) => String(n).padStart(length, '0');
  
  // Get UTC values
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  
  // Replace format tokens (supports common date-fns patterns)
  // Order matters: longer patterns first to avoid partial matches
  return formatPattern
    .replace(/yyyy/g, String(year))
    .replace(/yy/g, String(year).slice(-2))
    .replace(/MM/g, pad(month))
    .replace(/dd/g, pad(day))
    .replace(/HH/g, pad(hours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds))
    .replace(/M/g, String(month))
    .replace(/d/g, String(day))
    .replace(/H/g, String(hours))
    .replace(/m/g, String(minutes))
    .replace(/s/g, String(seconds));
}