import type { Detail } from '../data/profile'

export function DetailBody({ detail }: { detail: Detail }) {
  return (
    <div className="space-y-7">
      {detail.metrics && detail.metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 rounded-lg bg-neutral-50 px-5 py-4 dark:bg-neutral-800/50">
          {detail.metrics.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                {m.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {detail.sections.map((section) => (
        <section key={section.heading}>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {section.heading}
          </h4>
          <div className="mt-2.5 space-y-3">
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
