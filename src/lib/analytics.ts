// 방문 분석 (GoatCounter).
//
// 쿠키를 쓰지 않고 개인을 식별하지 않는 서비스라 동의 배너가 필요 없습니다.
// src/content/settings.json의 goatcounter에 사이트 코드를 넣으면 켜지고, 비우면 아무것도 하지 않습니다.
// 개발 서버에서는 보내지 않습니다.
//
// 기록하는 것 (GoatCounter 대시보드의 경로 이름)
// - 방문:       /?for=fintech&ref=회사   (지원처별 링크로 들어왔는지)
// - 상세 모달:  modal: <제목>
// - PDF 저장:   pdf: 이력서 / pdf: 경력기술서
// - 바깥 링크:  link: github.com, link: mailto 같은 주소의 호스트

import { queryParam, settings } from '../data/profile'

type Count = { path: string; title?: string; event?: boolean }

declare global {
  interface Window {
    goatcounter?: { count?: (vars: Count) => void; no_onload?: boolean }
  }
}

const enabled = !import.meta.env.DEV && Boolean(settings.goatcounter)

/** 스크립트가 뜨기 전에 생긴 기록. 뜨면 한꺼번에 보냅니다 */
const queue: Count[] = []

function send(vars: Count) {
  if (!enabled) return
  const count = window.goatcounter?.count
  if (count) count(vars)
  else queue.push(vars)
}

/** 클릭 같은 사건 하나를 기록합니다 */
export function track(name: string) {
  send({ path: name, title: name, event: true })
}

/** 지원처별 링크의 쿼리(for·ref)만 남긴 방문 경로 */
function visitPath() {
  const params = new URLSearchParams()
  for (const key of ['for', 'ref']) {
    const value = queryParam(key)
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `/?${query}` : '/'
}

/** 바깥으로 나가는 링크(새 탭·메일·전화)를 누르면 그 호스트를 기록합니다 */
function trackOutboundLinks() {
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]')
      if (!(a instanceof HTMLAnchorElement)) return
      const href = a.getAttribute('href') ?? ''
      if (/^(mailto|tel):/.test(href)) return track(`link: ${href.split(':')[0]}`)
      if (a.host && a.host !== location.host) track(`link: ${a.host}`)
    },
    { capture: true },
  )
}

export function startAnalytics() {
  if (!enabled) return

  // 첫 방문 기록은 경로를 직접 정해 보내므로 자동 기록을 끕니다
  window.goatcounter = { no_onload: true }

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://gc.zgo.at/count.js'
  script.dataset.goatcounter = `https://${settings.goatcounter}.goatcounter.com/count`
  script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true })
  script.addEventListener('load', () => {
    const count = window.goatcounter?.count
    if (!count) return
    count({ path: visitPath(), title: document.title })
    for (const vars of queue.splice(0)) count(vars)
  })
  document.head.append(script)

  trackOutboundLinks()
}
