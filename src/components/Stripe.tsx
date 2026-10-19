/**
 * 줄무늬 띠: 글자색 막대와 바탕 막대가 번갈아 놓입니다 (막대 하나 28px).
 * 첫 화면 카드 위와 푸터 위에만 쓰는, 이 페이지의 유일한 장식입니다.
 */
export function Stripe({ height }: { height: string }) {
  return (
    <div className={`stripe overflow-hidden ${height}`} aria-hidden="true">
      <div className="stripe-track flex h-full w-[calc(100%+56px)]">
        {Array.from({ length: 80 }, (_, i) => (
          <span key={i} className={`h-full w-7 shrink-0 ${i % 2 === 0 ? 'bg-ink' : ''}`} />
        ))}
      </div>
    </div>
  )
}
