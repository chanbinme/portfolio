import { createContext, useContext, useState } from 'react'
import { experiences } from '../data/profile'
import type {
  Experience as ExperienceItem,
  ExperienceProject,
  Position,
} from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { PrintDetail } from './PrintDetail'
import { EditableAdd, EditableRemove, EditableSet, EditableText } from '../dev/Editable'
import { BLANK, pathKey, rememberModal, shouldReopen, type Key } from '../dev/editor'

/** 경력을 읽고 고치는 JSON 파일. 포트폴리오는 experiences, 이력서 페이지는 resume */
type ExperienceFile = 'experiences' | 'resume'

/** 팀·프로젝트·기술 같은 하위 항목이 어느 파일을 고쳐야 하는지 알려줍니다 */
const FileContext = createContext<ExperienceFile>('experiences')

/** 열려 있는 경력. 상세를 고치려면 몇 번째 경력인지도 알아야 합니다 */
type Selected = { exp: ExperienceItem; index: number }

type ExperienceProps = {
  /** 그릴 경력. 비우면 포트폴리오 경력(experiences.json) */
  items?: ExperienceItem[]
  /** items를 읽어 온 파일 (인라인 편집이 이 파일을 고칩니다) */
  file?: ExperienceFile
}

export function Experience({ items = experiences, file = 'experiences' }: ExperienceProps) {
  const [selected, setSelected] = useState<Selected | null>(() => {
    if (!import.meta.env.DEV) return null
    const index = items.findIndex(
      (exp, i) => exp.detail && shouldReopen(pathKey(file, [i])),
    )
    return index < 0 ? null : { exp: items[index], index }
  })

  const open = (exp: ExperienceItem, index: number) => {
    rememberModal(pathKey(file, [index]))
    setSelected({ exp, index })
  }

  const close = () => {
    rememberModal(null)
    setSelected(null)
  }

  return (
    <FileContext.Provider value={file}>
      <Section id="experience" title="Experience" subtitle="결제·커머스 서비스를 개발해 왔습니다.">
        <ol className="relative space-y-8 border-l border-neutral-200 pl-6 dark:border-neutral-800">
          {items.map((exp, i) => (
            <li key={i} className="relative">
              {/* 타임라인 점 (회사) */}
              <span
                className="timeline-dot absolute top-2 -left-[28.5px] h-2 w-2 rounded-full bg-accent ring-4 ring-white dark:bg-accent-dark dark:ring-neutral-950"
                aria-hidden="true"
              />

              <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                <EditableText file={file} path={[i, 'period']}>
                  {exp.period}
                </EditableText>
              </p>

              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                <EditableText file={file} path={[i, 'company']}>
                  {exp.company}
                </EditableText>
                {(exp.role || import.meta.env.DEV) && (
                  <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
                    <EditableText file={file} path={[i, 'role']}>
                      {exp.role}
                    </EditableText>
                  </span>
                )}
                <EditableRemove file={file} path={[]} index={i} label="경력" />
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                <EditableText file={file} path={[i, 'summary']}>
                  {exp.summary}
                </EditableText>
              </p>

              {/* 팀을 옮긴 회사는 팀별로, 아니면 회사 단위로 */}
              {exp.positions.length > 0 && (
                <ol className="positions mt-6 space-y-8">
                  {exp.positions.map((pos, j) => (
                    <PositionItem
                      key={j}
                      position={pos}
                      company={exp.company}
                      path={[i, 'positions', j]}
                    />
                  ))}
                </ol>
              )}
              <EditableAdd
                file={file}
                path={[i, 'positions']}
                index={exp.positions.length}
                blank={BLANK.position}
                label="팀"
              />

              <ProjectList
                projects={exp.projects}
                context={exp.company}
                path={[i, 'projects']}
              />
              <HighlightList
                items={exp.highlights}
                context={exp.company}
                file={file}
                path={[i, 'highlights']}
              />
              <StackTags stack={exp.stack} path={[i, 'stack']} />

              {exp.detail && <PrintDetail detail={exp.detail} />}

              {!exp.detail && (
                <div className="mt-4">
                  <EditableSet
                    file={file}
                    path={[i, 'detail']}
                    value={BLANK.detail}
                    label="경력 전체 상세 만들기"
                  />
                </div>
              )}

              {exp.detail && (
                <button
                  type="button"
                  onClick={() => open(exp, i)}
                  className="mt-4 press inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-70 dark:text-accent-dark"
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
            </li>
          ))}
        </ol>

        <EditableAdd
          file={file}
          path={[]}
          index={items.length}
          blank={BLANK.experience}
          label="경력"
        />

        <Modal
          open={selected !== null}
          onClose={close}
          title={
            selected ? [selected.exp.company, selected.exp.role].filter(Boolean).join(' · ') : ''
          }
          meta={selected?.exp.period}
        >
          {selected?.exp.detail && (
            <DetailBody
              detail={selected.exp.detail}
              file={file}
              path={[selected.index, 'detail']}
            />
          )}
        </Modal>
      </Section>
    </FileContext.Provider>
  )
}

/** 회사 안의 팀 하나. 회사와 같은 타임라인 선 위에 속이 빈 점을 찍습니다. */
function PositionItem({
  position,
  company,
  path,
}: {
  position: Position
  company: string
  /** 이 팀까지의 JSON 경로 (예: [0, 'positions', 1]) */
  path: Key[]
}) {
  const file = useContext(FileContext)
  return (
    <li className="relative">
      <span
        className="timeline-dot absolute top-1.5 -left-[30px] h-[11px] w-[11px] rounded-full border-2 border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-950"
        aria-hidden="true"
      />

      <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
        <EditableText file={file} path={[...path, 'period']}>
          {position.period}
        </EditableText>
      </p>

      <h4 className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
        <EditableText file={file} path={[...path, 'team']}>
          {position.team}
        </EditableText>
        {(position.role || import.meta.env.DEV) && (
          <span className="ml-2 font-normal text-neutral-500 dark:text-neutral-400">
            <EditableText file={file} path={[...path, 'role']}>
              {position.role}
            </EditableText>
          </span>
        )}
        <EditableRemove
          file={file}
          path={path.slice(0, -1)}
          index={Number(path[path.length - 1])}
          label="팀"
        />
      </h4>

      {(position.summary || import.meta.env.DEV) && (
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <EditableText file={file} path={[...path, 'summary']}>
            {position.summary ?? ''}
          </EditableText>
        </p>
      )}

      <ProjectList
        projects={position.projects}
        context={`${company} · ${position.team}`}
        path={[...path, 'projects']}
      />
      <HighlightList
        items={position.highlights}
        context={`${company} · ${position.team}`}
        file={file}
        path={[...path, 'highlights']}
      />
      <StackTags stack={position.stack} path={[...path, 'stack']} />
    </li>
  )
}

/**
 * 프로젝트 단위로 묶은 성과.
 * 팀 아래 한 단계 더 들어가는 자리라, 타임라인 점을 더 찍는 대신
 * 왼쪽 선과 작은 제목으로만 묶음을 표시합니다.
 */
function ProjectList({
  projects,
  context,
  path,
}: {
  projects: ExperienceProject[]
  context: string
  /** 프로젝트 목록까지의 JSON 경로 */
  path: Key[]
}) {
  const file = useContext(FileContext)
  if (projects.length === 0 && !import.meta.env.DEV) return null

  return (
    <>
      <ol className="exp-projects mt-4 space-y-4">
        {projects.map((project, i) => (
          <li
            key={i}
            className="border-l border-neutral-200 pl-4 dark:border-neutral-800"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h5 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                <EditableText file={file} path={[...path, i, 'name']}>
                  {project.name}
                </EditableText>
                <EditableRemove
                  file={file}
                  path={path}
                  index={i}
                  label="프로젝트"
                  kind="project"
                />
              </h5>
              {(project.period || import.meta.env.DEV) && (
                <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                  <EditableText file={file} path={[...path, i, 'period']}>
                    {project.period ?? ''}
                  </EditableText>
                </span>
              )}
            </div>

            {(project.summary || import.meta.env.DEV) && (
              <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                <EditableText file={file} path={[...path, i, 'summary']}>
                  {project.summary ?? ''}
                </EditableText>
              </p>
            )}

            <HighlightList
              items={project.highlights}
              context={`${context} · ${project.name}`}
              file={file}
              path={[...path, i, 'highlights']}
            />
            <StackTags stack={project.stack} path={[...path, i, 'stack']} />
          </li>
        ))}
      </ol>

      <EditableAdd
        file={file}
        path={path}
        index={projects.length}
        blank={BLANK.experienceProject}
        label="프로젝트"
        dropKind="project"
      />
    </>
  )
}

function StackTags({ stack, path }: { stack: string[]; path: Key[] }) {
  const file = useContext(FileContext)
  if (stack.length === 0 && !import.meta.env.DEV) return null
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {stack.map((s, i) => (
        <Tag key={i}>
          <EditableText file={file} path={[...path, i]}>
            {s}
          </EditableText>
          <EditableRemove file={file} path={path} index={i} label="기술" />
        </Tag>
      ))}
      <EditableAdd
        file={file}
        path={path}
        index={stack.length}
        blank={BLANK.text}
        label="기술"
      />
    </div>
  )
}
