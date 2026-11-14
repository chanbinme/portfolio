// 타입 검사로는 잡을 수 없는 콘텐츠 실수를 빌드에서 막습니다.
//
// - views.json: id 형식·중복, 존재하지 않는 프로젝트 제목
//   (프로젝트 제목을 바꾸고 보기를 안 고치면 그 카드가 조용히 빠지기 때문입니다)
// - settings.json: GoatCounter 사이트 코드 형식
//
// 하나라도 어긋나면 빌드가 실패해 배포가 멈추고, 기존 사이트가 유지됩니다.

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

const readJson = async (name: string) =>
  JSON.parse(await readFile(resolve('src/content', `${name}.json`), 'utf8'))

const ID = /^[a-z0-9][a-z0-9-]*$/

export async function checkContent() {
  const problems: string[] = []
  const projects: { title?: string }[] = await readJson('projects')
  const views: { id?: string; projects?: (string | null)[] }[] = (await readJson('views')) ?? []
  const settings: { goatcounter?: string } = (await readJson('settings')) ?? {}

  const titles = new Set(projects.map((p) => p.title?.trim()))
  const seen = new Set<string>()
  for (const view of views) {
    const id = view.id?.trim() ?? ''
    if (!ID.test(id)) problems.push(`views.json: id "${id}"는 영문 소문자·숫자·하이픈만 쓸 수 있습니다`)
    if (seen.has(id)) problems.push(`views.json: id "${id}"가 두 번 나옵니다`)
    seen.add(id)
    for (const title of view.projects ?? []) {
      if (title && !titles.has(title.trim())) {
        problems.push(`views.json (${id}): 프로젝트 "${title}"가 projects.json에 없습니다`)
      }
    }
  }

  const code = settings.goatcounter?.trim()
  if (code && !ID.test(code)) {
    problems.push(`settings.json: goatcounter에는 사이트 코드만 적습니다 (예: chanbin). 지금 값: "${code}"`)
  }
  return problems
}

export function contentCheck(): Plugin {
  return {
    name: 'content-check',
    apply: 'build',
    async buildStart() {
      const problems = await checkContent()
      if (problems.length > 0) this.error(`콘텐츠 확인 실패\n- ${problems.join('\n- ')}`)
    },
  }
}
