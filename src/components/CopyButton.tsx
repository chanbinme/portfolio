import { useState } from 'react'

/** 클릭하면 값을 클립보드에 복사하고, 잠시 "복사됨"을 보여줍니다 */
export function CopyButton({ value, label = '복사' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // 클립보드 권한이 없으면(일부 브라우저·http) 임시 입력창으로 복사합니다
      const input = document.createElement('textarea')
      input.value = value
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-[0.8125rem] font-medium text-link transition-colors hover:bg-chip"
      aria-label={copied ? '복사했습니다' : `${value} ${label}`}
    >
      {copied ? (
        <CheckIcon />
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
      <span aria-live="polite">{copied ? '복사됨' : label}</span>
    </button>
  )
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
