import { useEffect, useRef, useState } from 'react'

/**
 * 요소가 화면에 들어오면 한 번만 true가 되는 훅.
 * 섹션 진입 시 은은한 fade-up 애니메이션에 사용합니다.
 *
 * 설계 노트: 애니메이션은 장식일 뿐이므로, 끝까지 재생된다는 보장이 없으면
 * 아예 시작하지 않습니다. 숨김 상태(opacity:0)는 트랜지션이 되돌려줘야만
 * 사라지는데, 탭이 백그라운드면 트랜지션이 0에서 멈춰 콘텐츠가 영영
 * 보이지 않기 때문입니다. `animate`가 false면 CSS는 숨김을 적용하지 않습니다.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  // 탭이 보이는 상태로 마운트될 때만 애니메이션을 겁니다.
  const [animate] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible' &&
      'IntersectionObserver' in window,
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !animate) return

    const reveal = () => setVisible(true)

    // 이미 화면 안에 있으면 관찰 없이 즉시 표시 (첫 화면 섹션 대응)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal()
      return
    }

    // threshold는 쓰지 않습니다. 섹션이 뷰포트보다 길면 특정 비율을 영영
    // 채우지 못해 콘텐츠가 투명한 채로 남기 때문입니다.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)

    // 아직 나타나지 않은 섹션이 남은 채 탭이 백그라운드로 가면
    // 트랜지션이 멈추므로, 애니메이션을 포기하고 바로 보여줍니다.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reveal()
        observer.disconnect()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [animate])

  return { ref, visible, animate }
}
