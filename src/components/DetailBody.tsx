import type { Detail } from '../data/profile'
import { Bullet } from './Bullet'

export function DetailBody({ detail }: { detail: Detail }) {
  return (
    <div className="space-y-7">
      {detail.metrics && detail.metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 rounded-lg bg-neutral-50 px-5 py-4 dark:bg-neutral-800/50">
          {detail.metrics.map((m, i) => (
            <div key={`${i}-${m.label}`}>
              <dt className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {m.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {detail.sections.map((section, i) => (
        <section key={`${i}-${section.heading}`}>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {section.heading}
          </h4>

          {/* list면 항목마다 점을 붙인 목록, 아니면 문단 */}
          {section.list ? (
            <ul className="mt-2.5 space-y-1.5">
              {section.body.map((item, j) => (
                <li
                  key={`${j}-${item}`}
                  className="flex gap-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  <Bullet />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2.5 space-y-3">
              {section.body.map((paragraph, j) => (
                <p
                  key={`${j}-${paragraph}`}
                  className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
