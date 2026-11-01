// 개발 서버에서만 켜지는 콘텐츠 쓰기 API.
//
// `npm run dev`로 띄운 페이지에서 글을 고치면 이 미들웨어가
// src/content/*.json에 바로 써 줍니다. 저장하면 Vite가 파일 변경을 감지해
// 페이지를 새로 그리고, 고친 내용이 그대로 보입니다.
//
// 빌드 결과물에는 들어가지 않습니다(apply: 'serve'). 배포된 사이트에는
// 이 API도, 이걸 부르는 편집 UI도 존재하지 않습니다.

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

/** 편집을 허용하는 파일. 여기 없는 이름은 받지 않습니다 */
const FILES = [
  'profile',
  'skills',
  'experiences',
  'projects',
  'opensource',
  'posts',
  'others',
] as const

type File = (typeof FILES)[number]

/** 객체 키 또는 배열 인덱스로 이뤄진 경로 */
type Key = string | number

type Patch =
  /** path가 가리키는 값을 value로 바꿉니다 */
  | { op: 'set'; file: File; path: Key[]; value: unknown }
  /** path가 가리키는 배열의 index 자리에 value를 끼워 넣습니다 */
  | { op: 'insert'; file: File; path: Key[]; index: number; value: unknown }
  /** path가 가리키는 배열에서 index 항목을 지웁니다 */
  | { op: 'remove'; file: File; path: Key[]; index: number }

export const ENDPOINT = '/__content'

const isKey = (v: unknown): v is Key =>
  typeof v === 'string' || (typeof v === 'number' && Number.isInteger(v) && v >= 0)

function parse(body: unknown): Patch {
  if (typeof body !== 'object' || body === null) throw new Error('본문이 객체가 아닙니다')
  const p = body as Record<string, unknown>

  if (!FILES.includes(p.file as File)) throw new Error(`모르는 파일: ${String(p.file)}`)
  if (!Array.isArray(p.path) || !p.path.every(isKey)) throw new Error('경로가 올바르지 않습니다')

  const file = p.file as File
  const path = p.path as Key[]

  if (p.op === 'set') return { op: 'set', file, path, value: p.value }

  if (p.op === 'insert' || p.op === 'remove') {
    if (typeof p.index !== 'number' || !Number.isInteger(p.index) || p.index < 0) {
      throw new Error('index가 올바르지 않습니다')
    }
    return p.op === 'insert'
      ? { op: 'insert', file, path, index: p.index, value: p.value }
      : { op: 'remove', file, path, index: p.index }
  }

  throw new Error(`모르는 작업: ${String(p.op)}`)
}

/** 경로를 따라 들어가 마지막 직전까지의 값을 돌려줍니다 */
function walk(root: unknown, path: Key[]): unknown {
  let node: unknown = root
  for (const key of path) {
    if (node === null || typeof node !== 'object') {
      throw new Error(`경로가 끊겼습니다: ${path.join('.')}`)
    }
    node = (node as Record<Key, unknown>)[key]
  }
  return node
}

function apply(root: unknown, patch: Patch): unknown {
  if (patch.op === 'set') {
    if (patch.path.length === 0) return patch.value
    const parent = walk(root, patch.path.slice(0, -1))
    if (parent === null || typeof parent !== 'object') {
      throw new Error(`경로가 끊겼습니다: ${patch.path.join('.')}`)
    }
    ;(parent as Record<Key, unknown>)[patch.path[patch.path.length - 1]] = patch.value
    return root
  }

  const target = walk(root, patch.path)
  if (!Array.isArray(target)) {
    throw new Error(`배열이 아닙니다: ${patch.path.join('.') || '(루트)'}`)
  }
  if (patch.index > target.length) throw new Error('index가 배열 범위를 넘었습니다')

  if (patch.op === 'insert') target.splice(patch.index, 0, patch.value)
  else target.splice(patch.index, 1)

  return root
}

async function readBody(req: NodeJS.ReadableStream): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buf = chunk as Buffer
    size += buf.length
    // 콘텐츠 한 조각을 고치는 요청이라 이 이상 커질 일이 없습니다
    if (size > 1_000_000) throw new Error('본문이 너무 큽니다')
    chunks.push(buf)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function contentEditor(): Plugin {
  return {
    name: 'portfolio-content-editor',
    // 개발 서버에서만 동작합니다. 빌드에는 관여하지 않습니다
    apply: 'serve',

    configureServer(server) {
      const dir = resolve(server.config.root, 'src/content')

      server.middlewares.use(ENDPOINT, (req, res, next) => {
        if (req.method !== 'POST') return next()

        void (async () => {
          try {
            const patch = parse(await readBody(req))
            const path = resolve(dir, `${patch.file}.json`)
            // FILES로 한 번 걸렀지만, 경로가 폴더를 벗어나지 않는지 다시 확인합니다
            if (!path.startsWith(dir)) throw new Error('허용되지 않은 경로')

            const next = apply(JSON.parse(await readFile(path, 'utf8')), patch)
            // 손으로 고친 파일과 같은 모양을 유지합니다 (2칸 들여쓰기 + 끝 줄바꿈)
            await writeFile(path, `${JSON.stringify(next, null, 2)}\n`, 'utf8')

            res.statusCode = 204
            res.end()
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            server.config.logger.warn(`[content-editor] ${message}`)
            res.statusCode = 400
            res.setHeader('content-type', 'text/plain; charset=utf-8')
            res.end(message)
          }
        })()
      })
    },
  }
}
