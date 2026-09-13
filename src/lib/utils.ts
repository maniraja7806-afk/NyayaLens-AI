import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes gracefully.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
