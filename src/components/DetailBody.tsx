import type { Detail } from '../data/profile'
import { Bullet } from './Bullet'

export function DetailBody({ detail }: { detail: Detail }) {
  return (
    <div className="space-y-7">
      {detail.metrics && detail.metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 bg-chip px-5 py-4">
          {detail.metrics.map((m, i) => (
            <div key={`${i}-${m.label}`}>
              <dt className="text-sm text-muted">
                {m.label}
              </dt>
              <dd className="num mt-1 text-[0.9375rem] font-semibold text-fg">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {detail.sections.map((section, i) => (
        <section key={`${i}-${section.heading}`}>
          <h4 className="text-[0.9375rem] font-semibold text-fg">
            {section.heading}
          </h4>

          {/* list면 항목마다 점을 붙인 목록, 아니면 문단 */}
          {section.list ? (
            <ul className="mt-2.5 space-y-1.5">
              {section.body.map((item, j) => (
                <li
                  key={`${j}-${item}`}
                  className="flex gap-3 text-[0.9375rem] text-fg"
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
                  className="text-[0.9375rem] text-fg"
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
