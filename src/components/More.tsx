import { others, otherCategories } from '../data/profile'
import { Section } from './Section'

const FALLBACK = '기타'

// 정해진 묶음 순서대로, 묶음 안에서는 content 파일에 적은 순서(최신순) 그대로
const groups = [...otherCategories, FALLBACK]
  .map((name) => ({
    name,
    items: others.filter((o) => {
      const known = (otherCategories as readonly string[]).includes(o.category)
      return (known ? o.category : FALLBACK) === name
    }),
  }))
  .filter((g) => g.items.length > 0)

export function More() {
  return (
    <Section id="more" title="More" subtitle="자격, 학력, 활동, 그 외 이력입니다.">
      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.name}>
            <h3 className="border-b border-neutral-200 pb-2 text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:text-neutral-100">
              {group.name}
            </h3>

            <ul className="mt-5 space-y-5">
              {group.items.map((item, i) => (
                <li key={`${i}-${item.title}`} className="sm:flex sm:gap-6">
                  <span className="shrink-0 font-mono text-xs text-neutral-500 sm:w-32 sm:pt-0.5 dark:text-neutral-400">
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
          </div>
        ))}
      </div>
    </Section>
  )
}
