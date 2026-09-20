import { skills } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-6">
        {skills.map((group) => (
          <div key={group.category} className="sm:flex sm:gap-6">
            <h3 className="shrink-0 font-mono text-xs text-neutral-400 sm:w-32 sm:pt-1.5 dark:text-neutral-500">
              {group.category}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 sm:mt-0">
              {group.items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
