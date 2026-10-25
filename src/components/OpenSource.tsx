import { useState } from 'react'
import { openSource } from '../data/profile'
import type { Contribution } from '../data/profile'
import { Section } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { Bullet } from './Bullet'
import { DetailTrigger } from './DetailTrigger'

type Selected = { project: string; contribution: Contribution }

export function OpenSource() {
  const [selected, setSelected] = useState<Selected | null>(null)

  if (openSource.length === 0) return null

  return (
    <Section
      id="opensource"
      title="Open Source"
      subtitle="실무에서 발견한 문제를 직접 수정해 기여했습니다."
    >
      <div className="space-y-8">
        {openSource.map((project, i) => (
          <div key={`${i}-${project.name}`}>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              {project.name}
            </h3>

            <ul className="mt-3 space-y-3">
              {project.contributions.map((c, j) => (
                <li
                  key={`${j}-${c.number}`}
                  className="flex gap-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  <Bullet />
                  <div>
                    {c.detail ? (
                      <DetailTrigger
                        text={c.text}
                        onClick={() => setSelected({ project: project.name, contribution: c })}
                      />
                    ) : (
                      <span>{c.text}</span>
                    )}
                    <ContributionMeta contribution={c} />
                  </div>
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
        {selected?.contribution.detail && (
          <>
            <DetailBody detail={selected.contribution.detail} />
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
function ContributionMeta({ contribution: c }: { contribution: Contribution }) {
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
      <a
        href={c.url}
        target="_blank"
        rel="noreferrer noopener"
        className="text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100"
      >
        #{c.number}
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
        {c.status}
        {c.merged && ` ${c.merged}`}
      </span>
      {c.release && (
        <>
          <span aria-hidden="true">·</span>
          <span>{c.release} 반영</span>
        </>
      )}
    </p>
  )
}
