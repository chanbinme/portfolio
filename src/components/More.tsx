import { others } from '../data/profile'
import { Section, order } from './Section'

export function More() {
  return (
    <Section id="more" title="More" subtitle="활동 · 교육 · 그 외 이력">
      <ul className="space-y-9">
        {others.map((item, i) => (
          <li
            key={`${i}-${item.title}`}
            className="rise sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6"
            style={order(2 + i)}
          >
            <p className="text-small text-muted sm:pt-0.5">
              <time>{item.date}</time>
            </p>
            <div className="mt-1 sm:mt-0">
              <p className="text-body font-semibold text-ink">{item.title}</p>
              <p className="text-body text-muted">{item.issuer}</p>
              {item.note && <p className="mt-2 text-body text-ink">{item.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
