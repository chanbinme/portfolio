import { RichText } from '../lib/rich'

/** 새 탭으로 열리는 바깥 링크 표시 (↗) */
export function ExternalIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`inline-block align-[-0.1em] ${className}`}
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

/**
 * 누르면 링크가 새 탭으로 열리는 성과 문장.
 * 모달을 여는 DetailTrigger와 같은 점선 밑줄을 쓰고, 끝의 ↗로 바깥 링크임을 알립니다.
 */
export function LinkTrigger({ text, href }: { text: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="highlight-link group -my-0.5 py-0.5 transition-colors hover:text-neutral-900 active:text-accent active:duration-0 dark:hover:text-neutral-100 dark:active:text-accent-dark"
    >
      <span className="underline decoration-neutral-300 decoration-dashed underline-offset-4 transition-colors group-hover:decoration-accent dark:decoration-neutral-600 dark:group-hover:decoration-accent-dark">
        <RichText text={text} />
      </span>
      <ExternalIcon className="ml-1 text-neutral-400 transition-colors group-hover:text-accent dark:group-hover:text-accent-dark" />
    </a>
  )
}

/** 상세 모달이 있는 성과의 오른쪽 끝에 따로 붙는 링크 아이콘 (목록 항목의 flex 안에 둡니다) */
export function LinkIcon({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="링크 열기 (새 탭)"
      title={href}
      className="highlight-link press -my-0.5 flex h-[1.625em] shrink-0 items-center self-start rounded px-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-accent dark:hover:bg-neutral-800 dark:hover:text-accent-dark"
    >
      <ExternalIcon />
    </a>
  )
}
