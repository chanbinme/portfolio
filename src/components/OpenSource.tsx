import { useState } from 'react'
import { openSource } from '../data/profile'
import type { Contribution } from '../data/profile'
import { Section } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { DetailTrigger } from './DetailTrigger'
import { CodeDiff } from './CodeDiff'
import { CheckIcon } from './CopyButton'

type Selected = { project: string; contribution: Contribution }

export function OpenSource() {
  const [selected, setSelected] = useState<Selected | null>(null)
  if (openSource.length === 0) return null

  const count = openSource.reduce((n, p) => n + p.contributions.length, 0)
  const merged = openSource.reduce(
    (n, p) => n + p.contributions.filter((c) => c.status === 'Merged').length,
    0,
  )

  return (
    <Section
      id="opensource"
      title="오픈소스 기여"
      aside={
        <p className="num text-[0.9375rem] font-semibold text-fg">
          PR {count}건 · 머지 {merged}건
        </p>
      }
    >
      <div className="space-y-5">
        {openSource.map((project, i) => (
          <div key={`${i}-${project.name}`} className="entry card overflow-hidden">
            <h3 className="border-b border-line px-6 py-4 font-bold text-fg sm:px-7">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noreferrer noopener" className="no-url inline-flex min-h-8 items-center hover:underline">
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>
            <ul className="divide-y divide-line">
              {project.contributions.map((c, j) => (
                <li key={`${j}-${c.number}`} className="px-6 py-4 sm:px-7">
                  <p className="text-[0.9375rem] font-medium leading-relaxed text-fg">
                    {c.detail || c.code ? (
                      <DetailTrigger text={c.text} onClick={() => setSelected({ project: project.name, contribution: c })} />
                    ) : (
                      c.text
                    )}
                  </p>
                  <ContributionMeta contribution={c} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.contribution.text ?? ''}
        meta={selected ? `${selected.project} #${selected.contribution.number}` : undefined}
      >
        {selected && (
          <div className="space-y-7">
            {selected.contribution.detail && <DetailBody detail={selected.contribution.detail} />}
            {selected.contribution.code && (
              <section>
                <h4 className="text-[0.9375rem] font-semibold text-fg">바뀐 코드</h4>
                <div className="mt-2.5">
                  <CodeDiff code={selected.contribution.code} />
                </div>
              </section>
            )}
            <a
              href={selected.contribution.url}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline"
            >
              GitHub에서 PR 보기
            </a>
          </div>
        )}
      </Modal>
    </Section>
  )
}

/** PR 번호(링크) · 상태 · 머지 시점 · 반영 버전 */
function ContributionMeta({ contribution: c }: { contribution: Contribution }) {
  return (
    <p className="num mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      <a href={c.url} target="_blank" rel="noreferrer noopener" className="link font-medium">
        #{c.number}
      </a>
      <span
        className={`inline-flex items-center gap-1 rounded-md bg-chip px-2 py-0.5 text-xs font-semibold ${
          c.status === 'Merged' ? 'text-success' : 'text-link'
        }`}
      >
        {c.status === 'Merged' && <CheckIcon />}
        {c.status}
        {c.merged && ` ${c.merged}`}
      </span>
      {c.release && <span>{c.release} 반영</span>}
    </p>
  )
}
