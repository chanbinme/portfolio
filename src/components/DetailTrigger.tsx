import { Emphasis } from './Emphasis'

type DetailTriggerProps = {
  text: string
  onClick: () => void
}

/**
 * 클릭하면 상세 모달이 열리는 문장.
 * 점선 밑줄과 ⓘ 아이콘으로 클릭할 수 있다는 것을 알려줍니다.
 * (인쇄할 때는 index.css의 `li button` 규칙이 평범한 문장으로 되돌립니다)
 */
export function DetailTrigger({ text, onClick }: DetailTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group -my-0.5 cursor-pointer py-0.5 text-left transition-colors hover:text-fg"
    >
      <span className="underline decoration-muted decoration-dashed underline-offset-4 transition-colors group-hover:decoration-fg group-hover:decoration-solid">
        <Emphasis text={text} />
      </span>
      {/* 클릭 가능하다는 신호 */}
      <svg
        className="ml-1 inline-block align-[-0.1em] text-muted transition-colors group-hover:text-fg"
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    </button>
  )
}
