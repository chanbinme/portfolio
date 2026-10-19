import { Panel } from './Panel'

/*
 * 경력의 증거: 더즌 DBP 신규 프로젝트의 멀티모듈 구성.
 * 모듈 이름과 역할은 experiences.json의 해당 성과 상세에 적힌 그대로입니다.
 */
const MODULES = [
  { name: 'inbound-gateway', role: '외부 요청 수신 · Spring WebFlux · JWT 인증' },
  { name: 'api', role: '외부 사용자용 REST API' },
  { name: 'admin', role: '백오피스 API' },
  { name: 'outbound-gateway', role: '외부 시스템 연동 · 연동 이력 로깅' },
  { name: 'batch', role: '일일 거래 집계 · 토큰 갱신 자동화' },
  { name: 'core', role: '공통 예외·응답 포맷·유틸리티' },
]

export function ModulesEvidence({ fill }: { fill?: boolean }) {
  return (
    <Panel caption="더즌 DBP 신규 프로젝트 · 직접 설계한 Gradle 멀티모듈 6개" fill={fill}>
      <p className="text-lead font-semibold text-ink">요청이 들어와 나가기까지</p>
      <ol className="mt-8 space-y-5">
        {MODULES.map((m) => (
          <li key={m.name} className="grid gap-1 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <code className="font-[family-name:var(--font-code)] text-body font-semibold text-ink">
              {m.name}
            </code>
            <span className="text-body text-muted">{m.role}</span>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
