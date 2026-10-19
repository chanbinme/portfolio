import { useId, useState } from 'react'
import { Panel } from './Panel'

/*
 * 프로젝트의 증거이자 이 페이지의 라이브 요소.
 * 66 챌린지에서 Offset 페이지네이션을 No Offset으로 바꾼 이유를, 페이지를 옮겨 가며 봅니다.
 *
 * 숫자의 출처를 섞지 않습니다.
 * - 실측: 15만 건 기준 0.058s → 0.00032s (projects.json의 성과 상세)
 * - 계산: OFFSET은 앞의 행을 모두 읽고 버리므로 읽는 행 = OFFSET + LIMIT. 측정값이 아닙니다.
 */
const TOTAL = 150_000
const LIMIT = 20
const LAST_PAGE = TOTAL / LIMIT

const fmt = (n: number) => n.toLocaleString('ko-KR')

export function PagingEvidence({ fill }: { fill?: boolean }) {
  // 처음에는 실측 조건과 같은 마지막 페이지(15만 건 끝)에서 시작합니다
  const [page, setPage] = useState(LAST_PAGE)
  const inputId = useId()
  const offset = (page - 1) * LIMIT
  const offsetRead = offset + LIMIT
  // 15만 건 중 이 페이지의 첫 글 id (id가 빈틈없이 이어진다고 보고 계산)
  const cursor = TOTAL - offset

  return (
    <Panel caption="66 챌린지 · Offset → No Offset 전환. 실측은 15만 건 기준, 읽는 행 수는 계산값" fill={fill}>
      <label htmlFor={inputId} className="flex items-baseline justify-between gap-4">
        <span className="text-lead font-semibold text-ink">페이지를 옮겨 보세요</span>
        <span className="num text-body text-muted">
          {fmt(page)} / {fmt(LAST_PAGE)}
        </span>
      </label>
      <input
        id={inputId}
        type="range"
        min={1}
        max={LAST_PAGE}
        step={1}
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
        className="mt-4 h-11 w-full cursor-pointer accent-[var(--ink)]"
      />

      <div className="mt-8 space-y-8">
        <Query
          name="Offset"
          sql={`SELECT * FROM post\nORDER BY id DESC\nLIMIT ${LIMIT} OFFSET ${offset};`}
          read={offsetRead}
          note={`앞의 ${fmt(offset)}행을 읽고 버립니다`}
        />
        <Query
          name="No Offset"
          sql={`SELECT * FROM post\nWHERE id <= ${cursor}\nORDER BY id DESC\nLIMIT ${LIMIT};`}
          read={LIMIT}
          note="인덱스로 바로 찾아가 20행만 읽습니다"
        />
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-6">
        <div>
          <dt className="text-small text-muted">실측 · Offset</dt>
          <dd className="num mt-1 text-head font-semibold tracking-[-0.03em] text-ink">0.058s</dd>
        </div>
        <div>
          <dt className="text-small text-muted">실측 · No Offset</dt>
          <dd className="num mt-1 text-head font-semibold tracking-[-0.03em] text-ink">0.00032s</dd>
        </div>
      </dl>
    </Panel>
  )
}

function Query({ name, sql, read, note }: { name: string; sql: string; read: number; note: string }) {
  // 읽는 행의 비율 (막대 길이). 아주 작아도 보이게 최소 폭을 둡니다.
  const share = Math.max(read / TOTAL, 0.004)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body font-semibold text-ink">{name}</span>
        <span className="num text-small text-muted">읽는 행 {fmt(read)}</span>
      </div>
      <div className="mt-2 h-2 bg-ground" aria-hidden="true">
        <div className="h-full bg-ink transition-[width] duration-300" style={{ width: `${share * 100}%` }} />
      </div>
      <pre className="code mt-3 text-ink">{sql}</pre>
      <p className="mt-2 text-small text-muted">{note}</p>
    </div>
  )
}
