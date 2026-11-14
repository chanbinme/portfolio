// 빌드 결과(dist/)를 띄워 브라우저로 훑는 스모크 테스트입니다.
//
//   npm run build && npm run test:smoke
//
// 확인하는 것
// - 페이지가 콘솔 에러·런타임 예외 없이 뜨는지
// - 상세 모달을 여는 단추마다: 모달이 뜨고, 다른 요소에 가리지 않고 맨 위에 그려지고,
//   Esc로 닫히는지 (데스크톱·모바일 두 화면 크기)
// - 지원처별 보기(?for=)마다: Projects 카드가 views.json에 적은 순서로 앞에 오는지
//
// Playwright가 필요합니다. 없으면:
//   npm i -D playwright && npx playwright install chromium

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { preview } from 'vite'

// 프로젝트에 설치된 것을 먼저 쓰고, 없으면 전역(NODE_PATH) 설치본을 찾습니다.
// ESM import는 NODE_PATH를 보지 않아 require로 한 번 더 찾습니다.
let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  try {
    ;({ chromium } = createRequire(import.meta.url)('playwright'))
  } catch {
    console.error('playwright가 없습니다: npm i -D playwright && npx playwright install chromium')
    process.exit(2)
  }
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]
// 상세 모달을 여는 단추가 있는 섹션
const TRIGGERS = ['#experience', '#projects', '#opensource']
  .map((s) => `${s} li button[type=button], ${s} button:has-text("자세히 보기")`)
  .join(', ')

const server = await preview({ preview: { port: 0, open: false }, logLevel: 'silent' })
const url = server.resolvedUrls.local[0]
const browser = await chromium.launch()
const failures = []

try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

    await page.goto(url, { waitUntil: 'networkidle' })

    const triggers = page.locator(TRIGGERS)
    const count = await triggers.count()
    if (count === 0) failures.push(`[${vp.name}] 상세 모달을 여는 단추를 찾지 못함`)

    for (let i = 0; i < count; i++) {
      const trigger = triggers.nth(i)
      const label = ((await trigger.innerText()) || '').trim().slice(0, 40)
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()

      const dialog = page.locator('[role=dialog]')
      try {
        await dialog.waitFor({ state: 'visible', timeout: 2000 })
      } catch {
        failures.push(`[${vp.name}] 모달이 열리지 않음: ${label}`)
        continue
      }
      await page.waitForTimeout(500) // 열림 애니메이션

      // 모달 안 여러 지점에서 맨 위 요소가 모달인지 본다 (쌓임 맥락에 갇히면 뒤 내용이 덮음)
      const covered = await dialog.evaluate((el) => {
        const r = el.getBoundingClientRect()
        const points = [
          [r.left + r.width / 2, r.top + 20],
          [r.left + r.width / 2, r.top + r.height / 2],
          [r.left + 20, Math.min(r.bottom, innerHeight) - 20],
        ]
        return points.filter(([x, y]) => {
          const top = document.elementFromPoint(x, y)
          return top && !el.contains(top)
        }).length
      })
      if (covered > 0) failures.push(`[${vp.name}] 모달이 다른 요소에 가려짐: ${label}`)

      await page.keyboard.press('Escape')
      try {
        await dialog.waitFor({ state: 'detached', timeout: 2000 })
      } catch {
        failures.push(`[${vp.name}] Esc로 모달이 닫히지 않음: ${label}`)
        await page.reload({ waitUntil: 'networkidle' })
      }
    }

    for (const e of errors) failures.push(`[${vp.name}] 콘솔 에러: ${e}`)
    console.log(`${vp.name}: 모달 ${count}개 확인`)
    await page.close()
  }

  // 지원처별 보기: 적어 둔 프로젝트가 그 순서대로 맨 앞에 와야 합니다
  const views = JSON.parse(readFileSync('src/content/views.json', 'utf8')) ?? []
  const page = await browser.newPage()
  for (const view of views) {
    await page.goto(`${url}?for=${view.id}`, { waitUntil: 'networkidle' })
    const titles = await page.locator('#projects article h3').allInnerTexts()
    const expected = view.projects ?? []
    const actual = titles.slice(0, expected.length).map((t) => t.trim())
    if (expected.some((title, i) => !actual[i]?.startsWith(title))) {
      failures.push(`[?for=${view.id}] 카드 순서가 다름: ${actual.join(' / ')}`)
    }
  }
  console.log(`보기 ${views.length}개 확인`)
  await page.close()
} finally {
  await browser.close()
  await new Promise((resolve) => server.httpServer.close(resolve))
}

if (failures.length > 0) {
  console.error(`\n실패 ${failures.length}건`)
  for (const f of failures) console.error(`- ${f}`)
  process.exit(1)
}
console.log('스모크 테스트 통과')
