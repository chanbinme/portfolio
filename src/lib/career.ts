import { experiences } from '../data/profile'
import { formatMonths, isOngoing, totalMonths } from './period'

/** 총 경력 (회사 기간을 합치되 겹치는 달은 한 번만). 계산할 수 없으면 null */
export function totalCareer(): string | null {
  const months = totalMonths(experiences.map((e) => e.period))
  return months ? formatMonths(months) : null
}

/** 지금 다니는 곳: "회사 · 팀 · 직무". 재직 중인 경력이 없으면 null */
export function currentRole(): string | null {
  const exp = experiences.find((e) => isOngoing(e.period))
  if (!exp) return null
  const pos = exp.positions.find((p) => isOngoing(p.period)) ?? exp.positions[0]
  return [exp.company, pos?.team, pos?.role ?? exp.role].filter(Boolean).join(' · ')
}
