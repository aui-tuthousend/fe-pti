import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE_URL } from '../config/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function urlBuilder(path: string): string {
  return `${API_BASE_URL}/api${path}`;
}
