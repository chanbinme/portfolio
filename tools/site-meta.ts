// index.html의 탭 제목·링크 미리보기 제목을 profile.json에서 가져옵니다.
//
// 화면의 "이름 / 역할"과 브라우저 탭·카카오톡 미리보기가 따로 놀지 않도록,
// index.html의 %SITE_TITLE%을 "이름 · 역할"로 바꿔 넣습니다 (개발 서버와 빌드 모두).
// 직무 표기를 바꾸려면 src/content/profile.json의 role만 고치면 됩니다.

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export function siteMeta(): Plugin {
  return {
    name: 'site-meta',
    async transformIndexHtml(html) {
      const profile = JSON.parse(await readFile(resolve('src/content/profile.json'), 'utf8')) as {
        name?: string
        role?: string
      }
      const title = [profile.name, profile.role].map((s) => s?.trim()).filter(Boolean).join(' · ')
      return html.replaceAll('%SITE_TITLE%', title)
    },
  }
}
