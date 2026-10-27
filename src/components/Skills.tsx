import { skills } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'

export function Skills() {
  return (
    <Section id="skills" title="Skills" subtitle="주로 다뤄 온 기술들입니다.">
      <div className="space-y-6">
        {skills.map((group, i) => (
          <div key={`${i}-${group.category}`} className="sm:flex sm:gap-6">
            <h3 className="shrink-0 text-sm font-medium text-neutral-500 sm:w-32 sm:pt-0.5 dark:text-neutral-400">
              {group.category}
            </h3>
            <div className="mt-2 flex flex-wrap content-start items-start gap-1.5 sm:mt-0">
              {group.items.map((item, j) => (
                <Tag key={`${j}-${item}`}>{item}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
