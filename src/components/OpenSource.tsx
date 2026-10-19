import { useEffect, useRef, useState } from 'react'
import { openSource } from '../data/profile'
import type { Contribution } from '../data/profile'
import { Section, order } from './Section'
import { Modal } from './Modal'
import { DetailBody } from './DetailBody'
import { Bullet } from './Bullet'
import { DetailTrigger } from './DetailTrigger'
import { DiffEvidence } from './evidence/DiffEvidence'
import { useStage } from './evidence/StageContext'

type Selected = { project: string; contribution: Contribution }

/**
 * 가리키는 기여가 "지금" 기여가 되어, 오른쪽 증거판에 그 diff가 뜹니다.
 * 마우스를 올리거나, 키보드로 포커스하거나, 스크롤해서 화면 가운데로 오면 바뀝니다.
 */
export function OpenSource() {
  const [selected, setSelected] = useState<Selected | null>(null)
  const { contribution: active, setContribution } = useStage()
  const listRef = useRef<HTMLDivElement>(null)

  // 화면 가운데 띠를 지나는 행을 "지금" 기여로
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>('[data-index]')
    if (!rows || rows.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setContribution(Number((hit.target as HTMLElement).dataset.index))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rows.forEach((r) => observer.observe(r))
    return () => observer.disconnect()
  }, [setContribution])

  if (openSource.length === 0) return null

  let index = -1
  return (
    <Section
      id="opensource"
      title="Open Source"
      subtitle="실무에서 발견한 문제를 직접 고쳐, Spring 릴리스에 들어갔습니다."
    >
      <div ref={listRef} className="space-y-14">
        {openSource.map((project, i) => (
          <div key={`${i}-${project.name}`} className="rise" style={order(2 + i)}>
            <h3 className="text-lead font-semibold text-ink">{project.name}</h3>

            <ul className="mt-4 space-y-6">
              {project.contributions.map((c) => {
                index += 1
                const me = index
                const isActive = me === active
                return (
                  <li
                    key={`${me}-${c.number}`}
                    data-index={me}
                    onMouseEnter={() => setContribution(me)}
                    onFocusCapture={() => setContribution(me)}
                    className={`flex gap-3 text-body transition-colors ${isActive ? 'text-ink' : 'text-muted'}`}
                  >
                    <Bullet />
                    <div className="min-w-0 flex-1">
                      {c.detail ? (
                        <DetailTrigger
                          text={c.text}
                          onClick={() => setSelected({ project: project.name, contribution: c })}
                        />
                      ) : (
                        <span>{c.text}</span>
                      )}
                      <ContributionMeta contribution={c} />

                      {/* 좁은 화면에서는 증거판 대신 행 바로 아래에, 접어서 둡니다 */}
                      {c.code && (
                        <details className="evidence group/diff mt-3 lg:hidden">
                          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-body font-semibold text-ink [&::-webkit-details-marker]:hidden">
                            <span className="underline decoration-2 underline-offset-[0.3em]">바뀐 코드 보기</span>
                            <svg
                              className="transition-transform group-open/diff:rotate-90"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              aria-hidden="true"
                            >
                              <path d="M9 6l6 6-6 6" />
                            </svg>
                          </summary>
                          <div className="mt-3">
                            <DiffEvidence compact project={project.name} contribution={c} />
                          </div>
                        </details>
                      )}
                    </div>
                  </li>
                )
              })}
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
              className="link mt-8 inline-flex min-h-11 items-center text-body"
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
    <p className="num mt-1.5 flex flex-wrap items-center gap-x-2 text-small text-muted">
      <a href={c.url} target="_blank" rel="noreferrer noopener" className="link text-muted">
        #{c.number}
      </a>
      <span aria-hidden="true">·</span>
      <span className="font-semibold text-ink">
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
