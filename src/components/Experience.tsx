import { experiences } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'

export function Experience() {
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
          </li>
        ))}
      </ol>
    </Section>
  )
}
