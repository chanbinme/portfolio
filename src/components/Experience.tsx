import { useState } from 'react'
import { experiences } from '../data/profile'
import type { Experience as ExperienceItem, Position } from '../data/profile'
import { Section, order } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { StackTags } from './StackTags'
import { MoreButton } from './MoreButton'
import { ModulesEvidence } from './evidence/ModulesEvidence'

export function Experience() {
  const [selected, setSelected] = useState<ExperienceItem | null>(null)

  return (
    <Section id="experience" title="Experience" evidence={<ModulesEvidence />}>
      <div className="space-y-24">
        {experiences.map((exp, i) => (
          <article key={`${i}-${exp.company}`} className="company rise" style={order(2 + i)}>
            <p className="text-small text-muted">
              <time>{exp.period}</time>
            </p>
            <h3 className="mt-2 text-lead font-semibold text-ink">
              {exp.company}
              {exp.role && <span className="font-normal text-muted"> · {exp.role}</span>}
            </h3>
            <p className="mt-3 text-body text-ink">{exp.summary}</p>

            {/* 팀을 옮긴 회사는 팀별로: 선 대신 한 단계 밝은 면으로 나눕니다 */}
            {exp.positions.length > 0 && (
              <ol className="positions mt-10 space-y-3">
                {exp.positions.map((pos, j) => (
                  <PositionItem key={`${j}-${pos.team}`} position={pos} company={exp.company} />
                ))}
              </ol>
            )}

            <HighlightList items={exp.highlights} context={exp.company} />
            <StackTags stack={exp.stack} />
            {exp.detail && <MoreButton onClick={() => setSelected(exp)} />}
          </article>
        ))}
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? [selected.company, selected.role].filter(Boolean).join(' · ') : ''}
        meta={selected?.period}
      >
        {selected?.detail && <DetailBody detail={selected.detail} />}
      </Modal>
    </Section>
  )
}

function PositionItem({ position, company }: { position: Position; company: string }) {
  return (
    <li className="surface bg-surface p-6 sm:p-8">
      <p className="text-small text-muted">
        <time>{position.period}</time>
      </p>
      <h4 className="mt-1 text-body font-semibold text-ink">
        {position.team}
        {position.role && <span className="font-normal text-muted"> · {position.role}</span>}
      </h4>
      {position.summary && <p className="mt-3 text-body text-ink">{position.summary}</p>}
      <HighlightList items={position.highlights} context={`${company} · ${position.team}`} />
      <StackTags stack={position.stack} />
    </li>
  )
}
