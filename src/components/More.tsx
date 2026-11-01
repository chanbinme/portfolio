import { others, otherCategories } from '../data/profile'
import { Section } from './Section'
import { EditableAdd, EditableRemove, EditableText } from '../dev/Editable'
import { BLANK } from '../dev/editor'

const FALLBACK = '기타'

// 정해진 묶음 순서대로, 묶음 안에서는 content 파일에 적은 순서(최신순) 그대로
// 편집할 때 JSON의 몇 번째 항목인지 알아야 하므로 원래 인덱스를 함께 들고 다닙니다
const groups = [...otherCategories, FALLBACK]
  .map((name) => ({
    name,
    items: others
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const known = (otherCategories as readonly string[]).includes(item.category)
        return (known ? item.category : FALLBACK) === name
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
              {group.items.map(({ item, index }) => (
                <li key={index} className="sm:flex sm:gap-6">
                  <span className="shrink-0 font-mono text-xs text-neutral-500 sm:w-32 sm:pt-0.5 dark:text-neutral-400">
                    <EditableText file="others" path={[index, 'date']}>
                      {item.date}
                    </EditableText>
                  </span>
                  <div className="mt-1 sm:mt-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      <EditableText file="others" path={[index, 'title']}>
                        {item.title}
                      </EditableText>
                      <EditableRemove file="others" path={[]} index={index} label="항목" />
                    </p>
                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                      <EditableText file="others" path={[index, 'issuer']}>
                        {item.issuer}
                      </EditableText>
                    </p>
                    {(item.note || import.meta.env.DEV) && (
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <EditableText file="others" path={[index, 'note']}>
                          {item.note ?? ''}
                        </EditableText>
                      </p>
                    )}
                    {/* 어느 묶음에 들어갈지 정하는 값입니다. 화면에서는 묶음 제목과 겹치므로 개발 서버에서만 보입니다 */}
                    {import.meta.env.DEV && (
                      <p className="mt-1 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                        <EditableText file="others" path={[index, 'category']}>
                          {item.category}
                        </EditableText>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <EditableAdd
          file="others"
          path={[]}
          index={others.length}
          blank={BLANK.other}
          label="항목"
        />
      </div>
    </Section>
  )
}
