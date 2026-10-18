type BulletProps = {
  /** accent는 강조 목록(About), default는 일반 목록 */
  tone?: 'default' | 'accent'
}

/**
 * 목록 앞의 점.
 *
 * 화면에서는 배경색을 칠한 작은 원이지만, 인쇄할 때는 브라우저가 배경을
 * 빼기 때문에 사라집니다. 그래서 인쇄 스타일(index.css의 `.bullet`)에서
 * 텍스트 '•'로 바꿔 그립니다.
 */
export function Bullet({ tone = 'default' }: BulletProps) {
  const color =
    tone === 'accent'
      ? 'bg-accent dark:bg-accent-dark'
      : 'bg-neutral-400 dark:bg-neutral-600'

  return (
    <span
      className={`bullet mt-2 h-1 w-1 shrink-0 rounded-full ${color}`}
      aria-hidden="true"
    />
  )
}
