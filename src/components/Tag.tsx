type TagProps = {
  children: string
}

/** 기술 이름. 선 없이 한 단계 밝은 면으로만 구분합니다. */
export function Tag({ children }: TagProps) {
  return <span className="tag bg-surface px-2.5 py-1 text-small text-ink">{children}</span>
}
