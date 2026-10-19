import { others } from '../data/profile'
import { Section } from './Section'

export function More() {
  if (others.length === 0) return null
  return (
    <Section id="more" title="활동 · 교육">
      <ul className="card divide-y divide-line">
        {others.map((item, i) => (
          <li
            key={`${i}-${item.title}`}
            className="entry print-stack grid gap-1 px-6 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:px-7"
          >
            <p className="num text-sm font-medium text-fg">
              <time>{item.date}</time>
            </p>
            <div className="min-w-0">
              <p className="font-semibold text-fg">{item.title}</p>
              {item.issuer && <p className="text-[0.9375rem] text-muted">{item.issuer}</p>}
              {item.note && <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg">{item.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
