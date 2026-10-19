import { useState } from 'react'
import { projects } from '../data/profile'
import type { Project } from '../data/profile'
import { Section, order } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { HighlightList } from './HighlightList'
import { StackTags } from './StackTags'
import { MoreButton } from './MoreButton'
import { PagingEvidence } from './evidence/PagingEvidence'

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="직접 설계하고 만든 것들입니다."
      evidence={<PagingEvidence />}
    >
      <div className="space-y-24">
        {projects.map((project, i) => (
          <article key={`${i}-${project.title}`} className="rise" style={order(3 + i)}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-lead font-semibold text-ink">{project.title}</h3>
              <p className="text-small text-muted">
                <time>{project.period}</time>
              </p>
            </div>

            <p className="mt-3 text-body text-ink">{project.description}</p>

            <HighlightList items={project.points} context={project.title} />
            <StackTags stack={project.stack} />

            {(project.detail || project.repoUrl || project.liveUrl) && (
              <div className="mt-2 flex flex-wrap items-center gap-x-7">
                {project.detail && <MoreButton onClick={() => setSelected(project)} />}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className="link mt-6 inline-flex min-h-11 items-center text-body">
                    Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="link mt-6 inline-flex min-h-11 items-center text-body">
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
