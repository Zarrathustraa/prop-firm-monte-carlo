import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

export function formatCurrency(amount: number, includeCents: boolean = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0
  }).format(amount);
}

export function formatPercentage(decimal: number, decimals: number = 1): string {
  return `${(decimal * 100).toFixed(decimals)}%`;
}

export function formatPoints(points: number, decimals: number = 1): string {
  return `${points.toFixed(decimals)} pts`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Color utilities for trading UI
export const colors = {
  profit: '#00C851',
  loss: '#FF4444', 
  warning: '#FFB300',
  primary: '#1B3A5C',
  neutral: '#9AA0A6'
};

export function getChangeColor(value: number): string {
  if (value > 0) return colors.profit;
  if (value < 0) return colors.loss;
  return colors.neutral;
}
