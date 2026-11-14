// 링크 미리보기(카카오톡·슬랙·LinkedIn)용 OG 이미지를 빌드할 때 만듭니다.
//
// profile.json의 역할·이름·헤드라인으로 1200×630 PNG를 그려 dist/og.png로 내보냅니다.
// 문구를 바꾸면 다음 배포에서 이미지도 따라 바뀌니, 이미지를 따로 관리할 필요가 없습니다.
// index.html의 og:image가 이 파일을 가리킵니다.
//
// 빌드에서만 동작합니다(apply: 'build'). 미리 보려면 `npm run build` 뒤 dist/og.png를 엽니다.

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import type { Plugin } from 'vite'

const WIDTH = 1200
const HEIGHT = 630

// src/index.css의 포인트 색(--color-accent: oklch(0.58 0.19 255))을 sRGB로 옮긴 값
const ACCENT = '#0278e7'

type Profile = { name: string; role?: string; headline?: string }

/** satori가 받는 요소. React 없이 같은 모양의 객체로 씁니다 */
type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } }

const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
})

const font = (weight: string) =>
  readFile(resolve('node_modules/pretendard/dist/public/static', `Pretendard-${weight}.otf`))

export async function renderOgImage(profile: Profile, siteUrl: string) {
  const [regular, semibold, bold] = await Promise.all([
    font('Regular'),
    font('SemiBold'),
    font('Bold'),
  ])

  const tree = el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '88px 96px',
      background: '#ffffff',
      fontFamily: 'Pretendard',
      borderTop: `14px solid ${ACCENT}`,
    },
    [
      el('div', { display: 'flex', flexDirection: 'column' }, [
        profile.role &&
          el('div', { fontSize: 34, fontWeight: 600, color: ACCENT }, profile.role),
        el(
          'div',
          {
            marginTop: 18,
            fontSize: 124,
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.02,
            color: '#171717',
          },
          profile.name,
        ),
        profile.headline &&
          el(
            'div',
            {
              marginTop: 44,
              maxWidth: 1008,
              fontSize: 44,
              lineHeight: 1.35,
              color: '#404040',
              // 한국어가 글자 단위로 끊기지 않게 어절 단위로 줄을 바꿉니다
              wordBreak: 'keep-all',
            },
            profile.headline,
          ),
      ].filter(Boolean)),
      el(
        'div',
        { display: 'flex', fontSize: 28, color: '#737373' },
        siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      ),
    ],
  )

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Pretendard', data: regular, weight: 400, style: 'normal' },
      { name: 'Pretendard', data: semibold, weight: 600, style: 'normal' },
      { name: 'Pretendard', data: bold, weight: 700, style: 'normal' },
    ],
  })

  return new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()
}

/** 빌드 결과물에 og.png를 더합니다 */
export function ogImage(): Plugin {
  return {
    name: 'og-image',
    apply: 'build',
    async generateBundle() {
      const profile = JSON.parse(
        await readFile(resolve('src/content/profile.json'), 'utf8'),
      ) as Profile
      const html = await readFile(resolve('index.html'), 'utf8')
      const siteUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1] ?? ''

      this.emitFile({
        type: 'asset',
        fileName: 'og.png',
        source: await renderOgImage(profile, siteUrl),
      })
    },
  }
}
