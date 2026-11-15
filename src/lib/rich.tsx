// 문장 안의 강조 표기.
//
//   **굵게**     → 굵은 글씨
//   ==형광펜==   → 형광펜. 화면에 들어오면 강조한 길이만큼 왼쪽에서 오른쪽으로 그어집니다
//
// src/content/*.json의 모든 문장에 쓸 수 있습니다. 개발 서버의 편집 모드에서는
// 글자를 드래그하면 뜨는 도구(src/dev/MarkToolbar.tsx)로 표기를 붙이고 뗄 수 있습니다.
// 한 단계만 지원합니다 (형광펜 안에 굵게를 겹치지 않습니다).

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export type RichPart = { kind: 'text' | 'bold' | 'mark'; text: string }

const TOKEN = /\*\*(.+?)\*\*|==(.+?)==/gs

/** 문장을 일반 글자·굵게·형광펜 조각으로 나눕니다. 짝이 맞지 않는 표기는 글자 그대로 둡니다 */
export function parseRich(text: string): RichPart[] {
  const parts: RichPart[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0
    if (at > last) parts.push({ kind: 'text', text: text.slice(last, at) })
    parts.push(m[1] !== undefined ? { kind: 'bold', text: m[1] } : { kind: 'mark', text: m[2] })
    last = at + m[0].length
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) })
  return parts
}

/** 표기를 걷어낸 맨 글자. 모달 제목·문서 제목·이미지처럼 꾸밀 수 없는 자리에 씁니다 */
export const stripRich = (text: string) => text.replace(TOKEN, (_, bold, mark) => bold ?? mark)

/** 강조 표기를 그려 주는 글자. 표기가 없으면 글자만 돌려줍니다 */
export function RichText({ text }: { text: string }) {
  if (!text.includes('**') && !text.includes('==')) return <>{text}</>
  return (
    <>
      {parseRich(text).map((part, i) =>
        part.kind === 'bold' ? (
          <strong key={i} className="rich-bold">
            {part.text}
          </strong>
        ) : part.kind === 'mark' ? (
          <Mark key={i} text={part.text} />
        ) : (
          part.text
        ),
      )}
    </>
  )
}

/**
 * 형광펜. 처음 화면에 들어올 때 한 번 그어집니다.
 * 긋는 시간은 글자 수에 비례해(짧은 강조는 빠르게, 긴 강조는 천천히) 손으로 긋는 느낌을 냅니다.
 * 여러 줄에 걸치면 줄 순서대로 이어서 그어집니다 (index.css의 `.rich-mark`).
 */
function Mark({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    observe(el)
    return () => unobserve(el)
  }, [])

  const seconds = Math.min(1.4, 0.35 + text.length * 0.025)

  return (
    <mark
      ref={ref}
      className="rich-mark"
      style={{ '--mark-duration': `${seconds.toFixed(2)}s` } as CSSProperties}
    >
      {text}
    </mark>
  )
}

// 형광펜이 여러 개여도 관찰자는 하나만 둡니다
let observer: IntersectionObserver | null = null

function observe(el: Element) {
  if (typeof IntersectionObserver === 'undefined') {
    el.setAttribute('data-drawn', '')
    return
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-drawn', '')
        observer?.unobserve(entry.target)
      }
    },
    // 화면 아래쪽 끝에 걸치자마자가 아니라, 조금 올라와 눈에 들어올 때 긋습니다
    { rootMargin: '0px 0px -12% 0px' },
  )
  observer.observe(el)
}

function unobserve(el: Element) {
  observer?.unobserve(el)
}
