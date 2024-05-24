import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function areThereAnyStyles(styles: string | undefined) {
  if (!styles) return undefined;

  return styles;
}
