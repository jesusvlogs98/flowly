import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMonth(date: Date): string {
  return date.toISOString().slice(0, 7); // "YYYY-MM"
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}
