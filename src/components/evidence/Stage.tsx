import type { ReactNode } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { openSource } from '../../data/profile'
import { useStage } from './StageContext'
import { MetricsEvidence } from './MetricsEvidence'
import { ModulesEvidence } from './ModulesEvidence'
import { DiffEvidence } from './DiffEvidence'
import { PagingEvidence } from './PagingEvidence'

/*
 * 증거판: 넓은 화면의 오른쪽 절반. 스크롤해도 제자리에 있고,
 * 왼쪽에서 읽고 있는 섹션의 증거로 천천히 바뀝니다.
 * 증거가 없는 섹션(About·Skills·Writing·More)에서는 직전 증거를 그대로 둡니다.
 */
const ORDER = ['top', 'about', 'skills', 'experience', 'opensource', 'projects', 'writing', 'more']
const PANEL_OF: Record<string, Key> = {
  top: 'metrics',
  about: 'metrics',
  skills: 'metrics',
  experience: 'modules',
  opensource: 'diff',
  projects: 'paging',
  writing: 'paging',
  more: 'paging',
}
type Key = 'metrics' | 'modules' | 'diff' | 'paging'

/** 오픈소스 기여를 프로젝트 이름과 함께 한 줄로 */
export const contributions = openSource.flatMap((p) =>
  p.contributions.map((c) => ({ project: p.name, contribution: c })),
)

export function Stage() {
  const section = useActiveSection(ORDER) || 'top'
  const { contribution } = useStage()
  const current = contributions[contribution] ?? contributions[0]
  const active = PANEL_OF[section] ?? 'metrics'

  const panels: [Key, ReactNode][] = [
    ['metrics', <MetricsEvidence fill />],
    ['modules', <ModulesEvidence fill />],
    ['diff', current && <DiffEvidence fill project={current.project} contribution={current.contribution} />],
    ['paging', <PagingEvidence fill />],
  ]

  return (
    <div className="relative h-full">
      {panels.map(([key, node]) => (
        <div
          key={key}
          className="stage-panel absolute inset-0 overflow-y-auto"
          data-active={active === key}
          aria-hidden={active !== key}
          inert={active !== key}
        >
          {node}
        </div>
      ))}
    </div>
  )
}
