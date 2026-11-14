// 이력서 페이지(dist/resume/)를 인쇄해 dist/resume.pdf를 만듭니다.
//
//   npm run build && npm run build:pdf
//
// 사이트의 "이력서" 다운로드가 이 파일을 내려받습니다. 배포(GitHub Actions)에서 빌드 뒤에 돌고,
// 실패하면 배포가 멈춥니다. 인쇄 모양은 src/index.css의 @media print를 따르므로,
// 브라우저에서 이력서 페이지를 "PDF로 저장"한 것과 같은 결과가 나옵니다.

import { statSync } from 'node:fs'
import { preview } from 'vite'
import { chromium } from 'playwright'

const OUT = 'dist/resume.pdf'

const server = await preview({ preview: { port: 0, open: false }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0] // http://localhost:xxxx/portfolio/
const browser = await chromium.launch()

try {
  // 인쇄물은 항상 라이트 테마입니다 (index.css). 화면 테마와 무관하게 라이트로 엽니다
  const page = await browser.newPage({ colorScheme: 'light' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))

  // 방문 분석에 빌드 기계의 방문이 남지 않게 막습니다
  await page.route('https://gc.zgo.at/**', (r) => r.fulfill({ contentType: 'text/javascript', body: '' }))

  await page.goto(`${base}resume/`, { waitUntil: 'networkidle' })
  // 웹 글꼴(Pretendard 조각·JetBrains Mono)이 다 받아진 뒤에 찍어야 글자가 대체 글꼴로 나오지 않습니다
  await page.evaluate(() => document.fonts.ready)

  if (errors.length > 0) throw new Error(`이력서 페이지 오류:\n- ${errors.join('\n- ')}`)
  if ((await page.locator('#experience').count()) === 0) {
    throw new Error('이력서 페이지에 Experience가 없습니다')
  }

  await page.emulateMedia({ media: 'print' })
  // 여백·용지는 index.css의 @page(A4, 15mm 16mm)를 따릅니다
  await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true })
} finally {
  await browser.close()
  await new Promise((resolve) => server.httpServer.close(resolve))
}

console.log(`${OUT} (${Math.round(statSync(OUT).size / 1024)} KB)`)
