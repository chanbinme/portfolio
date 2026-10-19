import type { Detail } from '../data/profile'
import { Bullet } from './Bullet'

export function DetailBody({ detail }: { detail: Detail }) {
  return (
    <div className="space-y-7">
      {detail.metrics && detail.metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 bg-surface px-5 py-4">
          {detail.metrics.map((m, i) => (
            <div key={`${i}-${m.label}`}>
              <dt className="text-small text-muted">
                {m.label}
              </dt>
              <dd className="num mt-1 text-body font-semibold text-ink">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {detail.sections.map((section, i) => (
        <section key={`${i}-${section.heading}`}>
          <h4 className="text-body font-semibold text-ink">
            {section.heading}
          </h4>

          {/* list면 항목마다 점을 붙인 목록, 아니면 문단 */}
          {section.list ? (
            <ul className="mt-2.5 space-y-1.5">
              {section.body.map((item, j) => (
                <li
                  key={`${j}-${item}`}
                  className="flex gap-3 text-body text-ink"
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
                  className="text-body text-ink"
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
