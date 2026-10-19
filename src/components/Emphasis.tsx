import type { ReactNode } from 'react'

/*
 * 성과 문장 속 수치를 굵게 표시합니다 (예: "50%", "약 100배", "0.058s", "15만 건").
 * 채용 담당자가 문장을 다 읽지 않아도 성과의 크기가 눈에 들어오게 하려는 것입니다.
 * 내용을 바꿔도 따로 표시할 필요 없이 자동으로 적용됩니다.
 */
const NUMBER = /((?:약\s?)?\d[\d,.]*\s?(?:%|배|ms|s|초|건|명|개|만\s?건|만|K|M|TPS)?)/g

export function Emphasis({ text }: { text: string }): ReactNode {
  const parts = text.split(NUMBER)
  return parts.map((part, i) =>
    i % 2 === 1 && /\d/.test(part) && isMeasure(part) ? (
      <strong key={i} className="font-semibold text-fg">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

/** 단위가 붙은 수치만 강조합니다 (버전 "Java 11", 연도 "2023" 같은 숫자는 그대로) */
const isMeasure = (s: string) => /(%|배|ms|\ds$|초|건|명|개|만|K$|M$|TPS)/.test(s.trim())
