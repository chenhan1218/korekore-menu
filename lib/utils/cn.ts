import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合併 Tailwind CSS 類名
 * 用於 shadcn/ui 元件
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
