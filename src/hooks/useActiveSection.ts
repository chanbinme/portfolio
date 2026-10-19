import { useEffect, useState } from 'react'

/**
 * 지금 보고 있는 섹션의 id.
 *
 * 화면 위에서 20% 지점을 지나간 마지막 섹션이 현재 섹션입니다.
 * 단, 맨 아래에 닿으면 마지막 섹션으로 칩니다. 마지막 섹션은 짧아서
 * 끝까지 스크롤해도 20% 지점까지 올라오지 못하기 때문입니다.
 * 첫 섹션보다 위에서는 빈 문자열입니다.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState('')
  const key = ids.join(',')

  useEffect(() => {
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    let frame = 0
    const update = () => {
      frame = 0
      const { innerHeight, scrollY } = window
      const atBottom =
        scrollY > 0 &&
        Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(sections.at(-1)?.id ?? '')
        return
      }
      const line = innerHeight * 0.2
      const current = sections.filter((el) => el.getBoundingClientRect().top <= line).at(-1)
      setActive(current?.id ?? '')
    }
    // 스크롤마다 레이아웃을 읽지 않도록 프레임당 한 번만 계산합니다
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [key])

  return active
}
