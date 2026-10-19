/*
 * 기간 문자열("2023.06 — 2025.04", "2025.04 — 재직 중")을 해석해 개월 수를 셉니다.
 * 채용 담당자가 바로 볼 수 있게 회사별 기간과 총 경력을 화면에 표시하는 데 씁니다.
 *
 * 형식이 다르면(예: "2023.03") 계산하지 않고 null을 돌려줍니다. 그러면 화면은 기간만 보여줍니다.
 */

/** 진행 중을 뜻하는 끝 표기 */
const ONGOING = /재직|현재|진행|now|present/i

type YM = { y: number; m: number }

const parseYM = (s: string): YM | null => {
  const m = s.match(/(\d{4})\s*[.\-/년]\s*(\d{1,2})/)
  if (!m) return null
  const month = Number(m[2])
  return month >= 1 && month <= 12 ? { y: Number(m[1]), m: month } : null
}

const index = ({ y, m }: YM) => y * 12 + (m - 1)

/** 기간의 시작·끝 월 번호 (끝 포함). 해석할 수 없으면 null */
export function parsePeriod(period: string, today = new Date()): [number, number] | null {
  // 구분자: —, –, ~ 또는 앞뒤에 공백이 있는 - ("2023-06"처럼 날짜 안의 -와 구분)
  const [startText, endText] = period.split(/\s*[—–~]\s*|\s+-\s+/)
  if (!startText || endText === undefined) return null
  const start = parseYM(startText)
  if (!start) return null
  const end = ONGOING.test(endText)
    ? { y: today.getFullYear(), m: today.getMonth() + 1 }
    : parseYM(endText)
  if (!end || index(end) < index(start)) return null
  return [index(start), index(end)]
}

/** 개월 수 (시작 달과 끝 달 모두 포함) */
export function monthsOf(period: string, today = new Date()): number | null {
  const r = parsePeriod(period, today)
  return r ? r[1] - r[0] + 1 : null
}

/** 여러 기간의 총 개월 수. 겹치는 달은 한 번만 셉니다. */
export function totalMonths(periods: string[], today = new Date()): number | null {
  const months = new Set<number>()
  for (const p of periods) {
    const r = parsePeriod(p, today)
    if (r) for (let i = r[0]; i <= r[1]; i++) months.add(i)
  }
  return months.size > 0 ? months.size : null
}

/** 23 → "1년 11개월", 12 → "1년", 5 → "5개월" */
export function formatMonths(n: number) {
  const y = Math.floor(n / 12)
  const m = n % 12
  return [y > 0 ? `${y}년` : '', m > 0 ? `${m}개월` : ''].filter(Boolean).join(' ') || '1개월 미만'
}

/** 진행 중인 기간인지 */
export const isOngoing = (period: string) => ONGOING.test(period)
