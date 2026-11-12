import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 조건부 클래스를 합치고, 충돌하는 Tailwind 클래스는 뒤의 것이 이기게 합니다 (shadcn/ui 규약) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
