import { heroMetrics } from '../../data/profile'
import { Panel } from './Panel'

/** 첫 화면의 증거: 직접 측정한 개선 수치 */
export function MetricsEvidence({ fill }: { fill?: boolean }) {
  if (heroMetrics.length === 0) return null
  return (
    <Panel caption="실무에서 직접 측정한 개선 수치" fill={fill}>
      {/* 수치는 왼쪽 끝, 무엇이 줄었는지는 오른쪽 끝: 패널 폭을 끝까지 씁니다 */}
      <dl className="space-y-8 lg:space-y-10">
        {heroMetrics.map((m, i) => (
          <div
            key={`${i}-${m.label}`}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:gap-8"
          >
            <dt className="order-last mt-2 sm:mt-0 sm:pb-3 sm:text-right">
              <span className="block text-lead font-semibold text-ink">{m.label}</span>
              <span className="mt-1 block text-small text-muted">{m.source}</span>
            </dt>
            <dd className="num order-first text-display font-semibold tracking-[-0.04em] text-ink">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}
