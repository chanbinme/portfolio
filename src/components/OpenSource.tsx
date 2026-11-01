import { useState } from 'react'
import { openSource } from '../data/profile'
import type { Contribution } from '../data/profile'
import { Section } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { Bullet } from './Bullet'
import { DetailTrigger } from './DetailTrigger'
import { PrintDetail } from './PrintDetail'
import { EditableAdd, EditableRemove, EditableSet, EditableText } from '../dev/Editable'
import {
  BLANK,
  pathKey,
  rememberModal,
  shouldReopen,
  useEditing,
  type Key,
} from '../dev/editor'

/** 열려 있는 기여. 상세를 고치려면 몇 번째 기여인지도 알아야 합니다 */
type Selected = { project: string; contribution: Contribution; path: Key[] }

export function OpenSource() {
  const [selected, setSelected] = useState<Selected | null>(() => {
    if (!import.meta.env.DEV) return null
    for (const [i, project] of openSource.entries()) {
      for (const [j, c] of project.contributions.entries()) {
        const path = [i, 'contributions', j]
        if (c.detail && shouldReopen(pathKey('opensource', path))) {
          return { project: project.name, contribution: c, path }
        }
      }
    }
    return null
  })
  // 편집 중에는 상세가 달린 기여도 글자를 고칠 수 있어야 합니다
  const editing = useEditing()

  const open = (name: string, c: Contribution, path: Key[]) => {
    rememberModal(pathKey('opensource', path))
    setSelected({ project: name, contribution: c, path })
  }

  const close = () => {
    rememberModal(null)
    setSelected(null)
  }

  if (openSource.length === 0 && !import.meta.env.DEV) return null

  return (
    <Section
      id="opensource"
      title="Open Source"
      subtitle="실무에서 발견한 문제를 직접 수정해 기여했습니다."
    >
      <div className="space-y-8">
        {openSource.map((project, i) => (
          <div key={i}>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              <EditableText file="opensource" path={[i, 'name']}>
                {project.name}
              </EditableText>
              <EditableRemove file="opensource" path={[]} index={i} label="프로젝트" />
            </h3>

            <ul className="mt-3 space-y-3">
              {project.contributions.map((c, j) => (
                <li
                  key={j}
                  className="flex gap-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  <Bullet />
                  <div>
                    {c.detail && !editing ? (
                      <DetailTrigger
                        text={c.text}
                        onClick={() => open(project.name, c, [i, 'contributions', j])}
                      />
                    ) : (
                      <span>
                        <EditableText
                          file="opensource"
                          path={[i, 'contributions', j, 'text']}
                        >
                          {c.text}
                        </EditableText>
                        {c.detail ? (
                          <button
                            type="button"
                            onClick={() => open(project.name, c, [i, 'contributions', j])}
                            className="edit-btn edit-btn-add"
                          >
                            상세 열기
                          </button>
                        ) : (
                          <EditableSet
                            file="opensource"
                            path={[i, 'contributions', j, 'detail']}
                            value={BLANK.detail}
                            label="상세 만들기"
                          />
                        )}
                        <EditableRemove
                          file="opensource"
                          path={[i, 'contributions']}
                          index={j}
                          label="기여"
                        />
                      </span>
                    )}
                    <ContributionMeta
                      contribution={c}
                      path={[i, 'contributions', j]}
                    />
                    {c.detail && <PrintDetail detail={c.detail} />}
                  </div>
                </li>
              ))}
            </ul>
            <EditableAdd
              file="opensource"
              path={[i, 'contributions']}
              index={project.contributions.length}
              blank={BLANK.contribution}
              label="기여"
            />
          </div>
        ))}
        <EditableAdd
          file="opensource"
          path={[]}
          index={openSource.length}
          blank={BLANK.openSourceProject}
          label="프로젝트"
        />
      </div>

      <Modal
        open={selected !== null}
        onClose={close}
        title={selected?.contribution.text ?? ''}
        meta={selected ? `${selected.project} #${selected.contribution.number}` : undefined}
      >
        {selected?.contribution.detail && (
          <>
            <DetailBody
              detail={selected.contribution.detail}
              file="opensource"
              path={[...selected.path, 'detail']}
            />
            <a
              href={selected.contribution.url}
              target="_blank"
              rel="noreferrer noopener"
              className="link mt-7 inline-block text-sm"
            >
              GitHub에서 PR 보기
            </a>
          </>
        )}
      </Modal>
    </Section>
  )
}

/** PR 번호(링크) · 상태 · 머지 시점 · 반영 버전 */
function ContributionMeta({
  contribution: c,
  path,
}: {
  contribution: Contribution
  /** 이 기여까지의 JSON 경로 */
  path: Key[]
}) {
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
      <a
        href={c.url}
        target="_blank"
        rel="noreferrer noopener"
        className="text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100"
      >
        #
        <EditableText file="opensource" path={[...path, 'number']}>
          {c.number}
        </EditableText>
      </a>
      <span aria-hidden="true">·</span>
      {/* GitHub의 PR 상태 색을 따릅니다 (Merged 보라, Open 초록) */}
      <span
        className={
          c.status === 'Merged'
            ? 'text-violet-600 dark:text-violet-400'
            : 'text-emerald-600 dark:text-emerald-400'
        }
      >
        <EditableText file="opensource" path={[...path, 'status']}>
          {c.status}
        </EditableText>
        {(c.merged || import.meta.env.DEV) && (
          <>
            {' '}
            <EditableText file="opensource" path={[...path, 'merged']}>
              {c.merged ?? ''}
            </EditableText>
          </>
        )}
      </span>
      {(c.release || import.meta.env.DEV) && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            <EditableText file="opensource" path={[...path, 'release']}>
              {c.release ?? ''}
            </EditableText>{' '}
            반영
          </span>
        </>
      )}
      {/* PR 주소는 링크라 글자로는 보이지 않으므로, 고칠 수 있게 개발 서버에서만 꺼내 둡니다 */}
      {import.meta.env.DEV && (
        <>
          <span aria-hidden="true">·</span>
          <EditableText file="opensource" path={[...path, 'url']}>
            {c.url}
          </EditableText>
        </>
      )}
    </p>
  )
}
