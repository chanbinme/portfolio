import { useState } from 'react'
import { projects } from '../data/profile'
import type { Project } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="직접 설계하고 만든 것들입니다."
    >
      <div className="space-y-4">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                {project.title}
                {project.featured && (
                  <span className="ml-2 align-middle font-mono text-[10px] tracking-wide text-accent uppercase dark:text-accent-dark">
                    featured
                  </span>
                )}
              </h3>
              <span className="shrink-0 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                {project.period}
              </span>
            </div>

            <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {project.description}
            </p>

            <HighlightList
              items={project.points}
              context={project.title}
              tone="muted"
            />

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {project.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            {(project.detail || project.repoUrl || project.liveUrl) && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {project.detail && (
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="inline-flex items-center gap-1 font-medium text-accent transition-opacity hover:opacity-70 dark:text-accent-dark"
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

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ''}
        meta={selected?.period}
      >
        {selected?.detail && <DetailBody detail={selected.detail} />}
      </Modal>
    </Section>
  )
}
