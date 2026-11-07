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
  // 개발 서버에서는 비어 있는 묶음도 남겨, 거기에 첫 항목을 추가할 수 있게 합니다
  .filter((g) => g.items.length > 0 || (import.meta.env.DEV && g.name !== FALLBACK))

/** 묶음의 마지막 항목 바로 뒤 자리. 비어 있는 묶음이면 파일 맨 뒤 */
const endOf = (items: { index: number }[]) =>
  items.length > 0 ? items[items.length - 1].index + 1 : others.length

export function More() {
  return (
    <Section
      id="more"
      title="More"
      printTitle="Education & Activities"
      subtitle="자격, 학력, 활동, 그 외 이력입니다."
    >
      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.name} data-more-group={group.name}>
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
                      <EditableRemove
                        file="others"
                        path={[]}
                        index={index}
                        label="항목"
                        scope={group.name}
                      />
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
                    {/* 어느 묶음에 들어갈지 정하는 값입니다. 묶음 제목과 겹치므로 평소에는 보이지 않고,
                        알 수 없는 분류가 모이는 '기타'에서만 값을 고칠 수 있게 개발 서버에서 보여 줍니다 */}
                    {import.meta.env.DEV && group.name === FALLBACK && (
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

            {/* 이 묶음의 마지막 항목 바로 뒤에 넣어 묶음이 흩어지지 않게 하고, 분류는 묶음 이름으로 채웁니다 */}
            {group.name !== FALLBACK && (
              <EditableAdd
                file="others"
                path={[]}
                index={endOf(group.items)}
                blank={() => ({ ...BLANK.other(), category: group.name })}
                label={`${group.name} 항목`}
              />
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
