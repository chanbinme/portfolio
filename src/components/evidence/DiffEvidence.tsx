import type { Contribution } from '../../data/profile'
import { Panel } from './Panel'

type DiffEvidenceProps = {
  project: string
  contribution: Contribution
  fill?: boolean
  /** 목록 행 바로 아래에 놓일 때: 행 문장과 겹치는 제목을 뺍니다 */
  compact?: boolean
}

/** 오픈소스의 증거: 실제로 머지된 diff. 줄 앞 +/-로 추가·삭제를 구분합니다. */
export function DiffEvidence({ project, contribution: c, fill, compact }: DiffEvidenceProps) {
  if (!c.code) return null
  const lines = c.code.split('\n')

  return (
    <Panel
      caption={`${project} #${c.number} · ${c.status}${c.release ? ` · ${c.release} 반영` : ''}`}
      fill={fill}
    >
      {!compact && <p className="text-lead font-semibold text-ink">{c.text}</p>}
      <pre className={`code ${compact ? '' : 'mt-8'} -mx-6 bg-ground px-6 py-5 text-ink sm:-mx-10 sm:px-10`}>
        <code>
          {lines.map((line, i) => {
            const sign = line[0]
            const tone =
              sign === '+'
                ? 'bg-marker text-marker-ink'
                : sign === '-'
                  ? 'text-muted line-through decoration-1'
                  : 'text-ink'
            return (
              <span key={i} className={`block ${tone}`}>
                {line || ' '}
              </span>
            )
          })}
        </code>
      </pre>
    </Panel>
  )
}
