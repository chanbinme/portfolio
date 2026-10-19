import { skills } from '../data/profile'
import { Section, order } from './Section'

/**
 * 이름을 칼럼으로 나열합니다. 상자·배지 없이, 분류마다 새 묶음을 시작하고
 * 첫 줄에 분류 이름을 보조 글자색으로 적습니다.
 */
export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="skill-columns gap-10 sm:columns-2">
        {skills.map((group, i) => (
          <div
            key={`${i}-${group.category}`}
            className="skill-group rise mb-10 break-inside-avoid"
            style={order(2 + i)}
          >
            <h3 className="text-lead text-muted">{group.category}</h3>
            <ul className="mt-1">
              {group.items.map((item, j) => (
                <li key={`${j}-${item}`} className="text-lead text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
