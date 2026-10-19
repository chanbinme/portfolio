import { useState } from 'react'
import { experiences } from '../data/profile'
import type { Experience as ExperienceItem, Position } from '../data/profile'
import { totalCareer } from '../lib/career'
import { Section } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { StackTags } from './StackTags'
import { MoreButton } from './MoreButton'
import { Period } from './Period'

export function Experience() {
  const [selected, setSelected] = useState<ExperienceItem | null>(null)
  const career = totalCareer()

  return (
    <Section
      id="experience"
      title="경력"
      aside={career && <p className="num text-[0.9375rem] font-semibold text-fg">총 {career}</p>}
    >
      <ol className="card divide-y divide-line">
        {experiences.map((exp, i) => (
          <li
            key={`${i}-${exp.company}`}
            className="entry print-stack grid gap-4 p-6 sm:p-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8"
          >
            <Period period={exp.period} />

            <div className="min-w-0">
              <h3 className="text-xl font-bold text-fg">{exp.company}</h3>
              {exp.role && <p className="mt-0.5 font-medium text-fg">{exp.role}</p>}
              {exp.summary && <p className="mt-2 text-[0.9375rem] text-muted">{exp.summary}</p>}

              {exp.positions.length > 0 && (
                <ol className="positions mt-6 space-y-7 border-l-2 border-line pl-5">
                  {exp.positions.map((pos, j) => (
                    <PositionItem key={`${j}-${pos.team}`} position={pos} company={exp.company} />
                  ))}
                </ol>
              )}

              <HighlightList items={exp.highlights} context={exp.company} />
              <StackTags stack={exp.stack} />
              {exp.detail && (
                <div className="mt-3">
                  <MoreButton onClick={() => setSelected(exp)} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

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
    <li>
      <h4 className="font-bold text-fg">
        {position.team}
        {position.role && <span className="font-medium text-muted"> · {position.role}</span>}
      </h4>
      <div className="mt-0.5">
        <Period period={position.period} compact />
      </div>
      {position.summary && <p className="mt-2 text-[0.9375rem] text-muted">{position.summary}</p>}
      <HighlightList items={position.highlights} context={`${company} · ${position.team}`} />
      <StackTags stack={position.stack} />
    </li>
  )
}
