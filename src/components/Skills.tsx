import { skills } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'
import { EditableAdd, EditableRemove, EditableText } from '../dev/Editable'
import { BLANK } from '../dev/editor'

export function Skills() {
  return (
    <Section id="skills" title="Skills" subtitle="주로 다뤄 온 기술들입니다.">
      <div className="space-y-6">
        {skills.map((group, i) => (
          <div key={i} className="sm:flex sm:gap-6">
            <h3 className="shrink-0 text-sm font-medium text-neutral-500 sm:w-32 sm:pt-0.5 dark:text-neutral-400">
              <EditableText file="skills" path={[i, 'category']}>
                {group.category}
              </EditableText>
              <EditableRemove file="skills" path={[]} index={i} label="분류" />
            </h3>
            <div className="mt-2 flex flex-wrap content-start items-start gap-1.5 sm:mt-0">
              {group.items.map((item, j) => (
                <Tag key={j}>
                  <EditableText file="skills" path={[i, 'items', j]}>
                    {item}
                  </EditableText>
                  <EditableRemove
                    file="skills"
                    path={[i, 'items']}
                    index={j}
                    label="기술"
                  />
                </Tag>
              ))}
              <EditableAdd
                file="skills"
                path={[i, 'items']}
                index={group.items.length}
                blank={BLANK.text}
                label="기술"
              />
            </div>
          </div>
        ))}
        <EditableAdd
          file="skills"
          path={[]}
          index={skills.length}
          blank={BLANK.skillGroup}
          label="분류"
        />
      </div>
    </Section>
  )
}
