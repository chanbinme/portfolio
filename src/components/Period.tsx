import { formatMonths, isOngoing, monthsOf } from '../lib/period'

/** 기간 + 자동 계산한 근속 기간 + 재직 중 표시 */
export function Period({ period, compact = false }: { period: string; compact?: boolean }) {
  const months = monthsOf(period)
  // 진행 중인 기간은 초록 점으로 한눈에 구분합니다
  const ongoing = isOngoing(period)
  return (
    <p className={`num text-sm text-muted ${compact ? 'flex flex-wrap items-center gap-x-2' : ''}`}>
      <time className="font-medium text-fg">
        {ongoing && <span className="mr-1.5 inline-block size-2 rounded-full bg-success align-middle" aria-hidden="true" />}
        {period}
      </time>
      {months && (
        <span className={compact ? '' : 'mt-0.5 block'}>
          {compact && <span aria-hidden="true">· </span>}
          {formatMonths(months)}
        </span>
      )}
    </p>
  )
}
