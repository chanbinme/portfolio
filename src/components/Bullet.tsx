/**
 * 목록 앞의 점.
 *
 * 화면에서는 배경색을 칠한 작은 사각형이지만, 인쇄할 때는 브라우저가 배경을
 * 빼기 때문에 사라집니다. 그래서 인쇄 스타일(index.css의 `.bullet`)에서
 * 텍스트 '•'로 바꿔 그립니다.
 */
export function Bullet() {
  return <span className="bullet mt-[0.7em] size-1.5 shrink-0 bg-ink" aria-hidden="true" />
}
