import { useState } from 'react'
import { experiences } from '../data/profile'
import type { Experience as ExperienceItem } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'

export function Experience() {
  const [selected, setSelected] = useState<ExperienceItem | null>(null)

  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-10 border-l border-neutral-200 pl-6 dark:border-neutral-800">
        {experiences.map((exp) => (
          <li key={`${exp.company}-${exp.period}`} className="relative">
            {/* 타임라인 점 */}
            <span
              className="absolute top-2 -left-[25px] h-2 w-2 rounded-full bg-accent ring-4 ring-white dark:bg-accent-dark dark:ring-neutral-950"
              aria-hidden="true"
            />

            <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
              {exp.period}
            </p>

            <h3 className="mt-1.5 font-medium text-neutral-900 dark:text-neutral-100">
              {exp.company}
              <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
                {exp.role}
              </span>
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {exp.summary}
            </p>

            {exp.highlights.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {exp.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600"
                      aria-hidden="true"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {exp.stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            )}

            {exp.detail && (
              <button
                type="button"
                onClick={() => setSelected(exp)}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-70 dark:text-accent-dark"
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
        title={selected ? `${selected.company} · ${selected.role}` : ''}
        meta={selected?.period}
      >
        {selected?.detail && <DetailBody detail={selected.detail} />}
      </Modal>
    </Section>
  )
}
