import { useState } from 'react'
import { projects, RESUME_PROJECT_COUNT } from '../data/profile'
import type { Project } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { PrintDetail } from './PrintDetail'
import {
  EditableAdd,
  EditableRemove,
  EditableSet,
  EditableText,
  EditableToggle,
} from '../dev/Editable'
import { BLANK, pathKey, rememberModal, shouldReopen, useEditing } from '../dev/editor'

/** 열려 있는 프로젝트. 상세를 고치려면 몇 번째 프로젝트인지도 알아야 합니다 */
type Selected = { project: Project; index: number }

export function Projects() {
  const [selected, setSelected] = useState<Selected | null>(() => {
    if (!import.meta.env.DEV) return null
    const index = projects.findIndex(
      (project, i) => project.detail && shouldReopen(pathKey('projects', [i])),
    )
    return index < 0 ? null : { project: projects[index], index }
  })

  const editing = useEditing()

  // 숨긴 프로젝트는 편집할 때만 흐리게 보여, 다시 켤 수 있게 합니다.
  // 이력서 PDF에는 노출 중인 프로젝트 중 앞의 몇 개만 싣습니다 (나머지는 CSS가 가립니다)
  const cards: { project: Project; index: number; skipInResume: boolean }[] = []
  let forResume = 0
  projects.forEach((project, index) => {
    if (!project.visible && !editing) return
    cards.push({
      project,
      index,
      skipInResume: !project.visible || forResume++ >= RESUME_PROJECT_COUNT,
    })
  })

  const open = (project: Project, index: number) => {
    rememberModal(pathKey('projects', [index]))
    setSelected({ project, index })
  }

  const close = () => {
    rememberModal(null)
    setSelected(null)
  }

  // 노출할 프로젝트가 없으면 섹션도 메뉴도 그리지 않습니다 (개발 서버에서는 추가할 수 있게 둡니다)
  if (cards.length === 0 && !import.meta.env.DEV) return null

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="직접 설계하고 만든 것들입니다."
    >
      <div className={`grid gap-4 ${cards.length > 1 ? 'lg:grid-cols-2' : ''}`}>
        {cards.map(({ project, index: i, skipInResume }) => (
          <article
            key={i}
            data-hidden={project.visible ? undefined : ''}
            data-resume-skip={skipInResume ? '' : undefined}
            className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                <EditableText file="projects" path={[i, 'title']}>
                  {project.title}
                </EditableText>
                <EditableRemove file="projects" path={[]} index={i} label="프로젝트" />
                {(project.badge || editing) && (
                  <span className="ml-2 align-middle font-mono text-[10px] tracking-wide text-accent uppercase dark:text-accent-dark">
                    <EditableText file="projects" path={[i, 'badge']}>
                      {project.badge ?? ''}
                    </EditableText>
                  </span>
                )}
              </h3>
              <span className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                <EditableText file="projects" path={[i, 'period']}>
                  {project.period}
                </EditableText>
              </span>
            </div>

            {import.meta.env.DEV && (
              <div>
                <EditableToggle
                  file="projects"
                  path={[i, 'visible']}
                  value={project.visible}
                  label="포트폴리오 노출"
                />
              </div>
            )}

            {(project.affiliation || import.meta.env.DEV) && (
              <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                <EditableText file="projects" path={[i, 'affiliation']}>
                  {project.affiliation ?? ''}
                </EditableText>
              </p>
            )}

            <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              <EditableText file="projects" path={[i, 'description']}>
                {project.description}
              </EditableText>
            </p>

            <HighlightList
              items={project.points}
              context={project.title}
              tone="muted"
              file="projects"
              path={[i, 'points']}
            />

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {project.stack.map((s, j) => (
                <Tag key={j}>
                  <EditableText file="projects" path={[i, 'stack', j]}>
                    {s}
                  </EditableText>
                  <EditableRemove
                    file="projects"
                    path={[i, 'stack']}
                    index={j}
                    label="기술"
                  />
                </Tag>
              ))}
              <EditableAdd
                file="projects"
                path={[i, 'stack']}
                index={project.stack.length}
                blank={BLANK.text}
                label="기술"
              />
            </div>

            {project.detail && <PrintDetail detail={project.detail} />}

            {!project.detail && (
              <div className="mt-4">
                <EditableSet
                  file="projects"
                  path={[i, 'detail']}
                  value={BLANK.detail}
                  label="프로젝트 전체 상세 만들기"
                />
              </div>
            )}

            {(project.detail || project.repoUrl || project.liveUrl) && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {project.detail && (
                  <button
                    type="button"
                    onClick={() => open(project, i)}
                    className="press inline-flex items-center gap-1 font-medium text-accent hover:opacity-70 dark:text-accent-dark"
                  >
                    자세히 보기
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link"
                  >
                    Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link"
                  >
                    Live
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <EditableAdd
        file="projects"
        path={[]}
        index={projects.length}
        blank={BLANK.project}
        label="프로젝트"
      />

      <Modal
        open={selected !== null}
        onClose={close}
        title={selected?.project.title ?? ''}
        meta={[selected?.project.affiliation, selected?.project.period].filter(Boolean).join(' · ')}
      >
        {selected?.project.detail && (
          <DetailBody
            detail={selected.project.detail}
            file="projects"
            path={[selected.index, 'detail']}
          />
        )}
      </Modal>
    </Section>
  )
}
