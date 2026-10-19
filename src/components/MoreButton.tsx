/** 항목 전체의 상세 모달을 여는 버튼 */
export function MoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex min-h-11 cursor-pointer items-center gap-1 text-[0.9375rem] font-semibold text-link"
    >
      <span>자세히 보기</span>
      <svg
        className="transition-transform group-hover:translate-x-0.5"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  )
}
