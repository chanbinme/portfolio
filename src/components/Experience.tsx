import { useState } from 'react'
import { experiences } from '../data/profile'
import type { Experience as ExperienceItem, Position } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { PrintDetail } from './PrintDetail'

export function Experience() {
  const [selected, setSelected] = useState<ExperienceItem | null>(null)

  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-8 border-l border-neutral-200 pl-6 dark:border-neutral-800">
        {experiences.map((exp, i) => (
          <li key={`${i}-${exp.company}`} className="relative">
            {/* 타임라인 점 (회사) */}
            <span
              className="timeline-dot absolute top-2 -left-[28.5px] h-2 w-2 rounded-full bg-accent ring-4 ring-white dark:bg-accent-dark dark:ring-neutral-950"
              aria-hidden="true"
            />

            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {exp.period}
            </p>

            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {exp.company}
              {exp.role && (
                <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
                  {exp.role}
                </span>
              )}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {exp.summary}
            </p>

            {/* 팀을 옮긴 회사는 팀별로, 아니면 회사 단위로 */}
            {exp.positions.length > 0 && (
              <ol className="positions mt-6 space-y-8">
                {exp.positions.map((pos, j) => (
                  <PositionItem
                    key={`${j}-${pos.team}`}
                    position={pos}
                    company={exp.company}
                  />
                ))}
              </ol>
            )}

            <HighlightList items={exp.highlights} context={exp.company} />
            <StackTags stack={exp.stack} />

            {exp.detail && <PrintDetail detail={exp.detail} />}

            {exp.detail && (
              <button
                type="button"
                onClick={() => setSelected(exp)}
                className="mt-4 press inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-70 dark:text-accent-dark"
              >
                자세히 보기
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
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

/** 회사 안의 팀 하나. 회사와 같은 타임라인 선 위에 속이 빈 점을 찍습니다. */
function PositionItem({ position, company }: { position: Position; company: string }) {
  return (
    <li className="relative">
      <span
        className="timeline-dot absolute top-1.5 -left-[30px] h-[11px] w-[11px] rounded-full border-2 border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-950"
        aria-hidden="true"
      />

      <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {position.period}
      </p>

      <h4 className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
        {position.team}
        {position.role && (
          <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
            {position.role}
          </span>
        )}
      </h4>

      {position.summary && (
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {position.summary}
        </p>
      )}

      <HighlightList
        items={position.highlights}
        context={`${company} · ${position.team}`}
      />
      <StackTags stack={position.stack} />
    </li>
  )
}

function StackTags({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {stack.map((s, i) => (
        <Tag key={`${i}-${s}`}>{s}</Tag>
      ))}
    </div>
  )
}
