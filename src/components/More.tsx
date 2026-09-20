import { others } from '../data/profile'
import { Section } from './Section'

export function More() {
  return (
    <Section id="more" title="More" subtitle="자격증 · 활동 · 그 외 이력">
      <ul className="space-y-5">
        {others.map((item) => (
          <li key={`${item.title}-${item.date}`} className="sm:flex sm:gap-6">
            <span className="shrink-0 font-mono text-xs text-neutral-400 sm:w-32 sm:pt-0.5 dark:text-neutral-500">
              {item.date}
            </span>
            <div className="mt-1 sm:mt-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {item.title}
              </p>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {item.issuer}
              </p>
              {item.note && (
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {item.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
