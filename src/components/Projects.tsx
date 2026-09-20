import { projects } from '../data/profile'
import { Section } from './Section'
import { Tag } from './Tag'

export function Projects() {
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

            {project.points.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {project.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {project.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            {(project.repoUrl || project.liveUrl) && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
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
    </Section>
  )
}
