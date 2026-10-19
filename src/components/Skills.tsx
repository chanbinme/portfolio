import { skills } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'

export function Skills() {
  if (skills.length === 0) return null
  return (
    <Section id="skills" title="기술 스택">
      <dl className="card divide-y divide-line">
        {skills.map((group, i) => (
          <div
            key={`${i}-${group.category}`}
            className="skill-group grid gap-2 px-6 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6 sm:px-7"
          >
            <dt className="pt-0.5 text-[0.9375rem] font-semibold text-fg">{group.category}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {group.items.map((item, j) => (
                <Tag key={`${j}-${item}`}>{item}</Tag>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
