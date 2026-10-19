import { useState } from 'react'
import { projects } from '../data/profile'
import type { Project } from '../data/profile'
import { Section } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { StackTags } from './StackTags'
import { MoreButton } from './MoreButton'
import { Period } from './Period'

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  if (projects.length === 0) return null

  return (
    <Section id="projects" title="프로젝트">
      <div className="print-stack grid gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <article key={`${i}-${project.title}`} className="entry card flex flex-col p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-fg">{project.title}</h3>
              {project.featured && (
                <span className="no-print rounded-md bg-chip px-2 py-0.5 text-xs font-semibold text-link">대표</span>
              )}
            </div>
            <div className="mt-1">
              <Period period={project.period} compact />
            </div>

            <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg">{project.description}</p>

            <HighlightList items={project.points} context={project.title} />
            <StackTags stack={project.stack} />

            {(project.detail || project.repoUrl || project.liveUrl) && (
              <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-5">
                {project.detail && <MoreButton onClick={() => setSelected(project)} />}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className="link inline-flex min-h-11 items-center text-[0.9375rem] font-medium">
                    코드
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="link inline-flex min-h-11 items-center text-[0.9375rem] font-medium">
                    서비스
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
