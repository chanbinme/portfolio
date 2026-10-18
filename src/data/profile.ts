// ─────────────────────────────────────────────────────────────
// 사이트 내용은 src/content/*.json에 있습니다.
// 직접 고쳐도 되고, 관리자 페이지(/portfolio/admin/)에서 고칠 수도 있습니다.
//
// 이 파일은 JSON을 읽어 타입을 보장하는 계층입니다. 관리자 페이지는
// 비워 둔 칸을 빼거나 빈 문자열·null로 저장할 수 있으므로, 여기서
// 빈 값을 정리해 컴포넌트가 항상 같은 모양의 데이터를 받게 합니다.
//
// JSON 구조가 아래 타입과 맞지 않으면 빌드(tsc)가 실패해 배포가 멈춥니다.
// 즉 잘못된 수정은 사이트에 올라가지 않고, 기존 사이트가 그대로 유지됩니다.
// ─────────────────────────────────────────────────────────────

import profileJson from '../content/profile.json'
import skillsJson from '../content/skills.json'
import experiencesJson from '../content/experiences.json'
import projectsJson from '../content/projects.json'
import postsJson from '../content/posts.json'
import othersJson from '../content/others.json'

// ── 타입 ─────────────────────────────────────────────────────

export type SocialLink = {
  label: string
  href: string
}

/** 첫 화면에 숫자로 보여줄 대표 성과. 3개 안팎이 적당합니다. */
export type HeroMetric = {
  value: string
  label: string
  /** 어디서 낸 성과인지 */
  source: string
}

export type SkillGroup = {
  category: string
  items: string[]
}

/**
 * 클릭하면 뜨는 상세 모달의 본문.
 * `detail`을 넣은 항목만 클릭할 수 있게 되고, 없으면 평범한 항목으로 남습니다.
 */
export type Detail = {
  /** 각 문단은 소제목 + 본문 문단들로 구성됩니다 */
  sections: {
    heading: string
    /** true면 body를 점 목록으로, 아니면 문단으로 표시합니다 */
    list?: boolean
    body: string[]
  }[]
  /** 선택: 성과를 숫자로 보여주고 싶을 때 */
  metrics?: { label: string; value: string }[]
}

/** 성과 한 줄. `detail`이 있으면 그 문장이 클릭 가능해져 상세 모달이 열립니다. */
export type Highlight = {
  text: string
  detail?: Detail
}

/** 한 회사 안에서 팀을 옮긴 경우의 팀별 경력 */
export type Position = {
  team: string
  role: string
  period: string
  /** 그 팀에서 맡은 일 한 줄 */
  summary?: string
  highlights: Highlight[]
  stack: string[]
}

export type Experience = {
  company: string
  /** 팀을 나누지 않을 때의 직무. positions를 쓰면 비워 둡니다. */
  role: string
  /** 회사 전체 재직 기간 */
  period: string
  /** 회사 소개 */
  summary: string
  /**
   * 팀별 경력 (최신순). 있으면 회사 아래에 팀별로 나눠 보여주고,
   * 없으면 아래 highlights·stack을 회사 단위로 보여줍니다.
   */
  positions: Position[]
  /** 성과 목록. 문장별로 detail을 붙이면 그 문장이 클릭 가능해집니다. */
  highlights: Highlight[]
  stack: string[]
  /** 회사 전체에 대한 상세 (개별 성과가 아닌 경력 자체를 설명할 때) */
  detail?: Detail
}

export type Project = {
  title: string
  period: string
  description: string
  /** 성과 목록. 문장별로 detail을 붙이면 그 문장이 클릭 가능해집니다. */
  points: Highlight[]
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  featured?: boolean
  detail?: Detail
}

export type Post = {
  title: string
  url: string
  /** 선택: 발행일을 적으면 제목 오른쪽에 표시됩니다 */
  date?: string
  /** 선택: 한 줄 요약 */
  excerpt?: string
}

export type OtherItem = {
  title: string
  issuer: string
  date: string
  note?: string
}

// ── 정규화 ───────────────────────────────────────────────────

/**
 * 관리자 페이지가 저장할 수 있는 느슨한 모양.
 * 모든 필드가 빠지거나 null일 수 있다고 보고 받아들입니다.
 */
type Loose<T> = T extends string | number | boolean
  ? T | null
  : T extends (infer U)[]
    ? Loose<U>[] | null
    : { [K in keyof T]?: Loose<T[K]> | null } | null

type Maybe<T> = T | null | undefined

/** 필수 문자열: 비어 있으면 빈 문자열 */
const req = (v: Maybe<string>) => v?.trim() ?? ''

/** 선택 문자열: 비어 있으면 undefined (화면에서 아예 안 그림) */
const opt = (v: Maybe<string>) => v?.trim() || undefined

/** 문자열 목록: 빈 줄 제거 */
const lines = (v: Maybe<Maybe<string>[]>) =>
  (v ?? []).map((s) => req(s)).filter(Boolean)

/** 객체 목록: null 항목 제거 */
const list = <T>(v: Maybe<Maybe<T>[]>) =>
  (v ?? []).filter((x): x is NonNullable<T> => x != null)

function toDetail(d: Maybe<Loose<Detail>>): Detail | undefined {
  if (!d) return undefined
  const sections = list(d.sections)
    .map((s) => ({ heading: req(s.heading), list: s.list === true, body: lines(s.body) }))
    .filter((s) => s.heading || s.body.length > 0)
  const metrics = list(d.metrics)
    .map((m) => ({ label: req(m.label), value: req(m.value) }))
    .filter((m) => m.label || m.value)
  // 내용이 없는 상세는 없는 것으로 칩니다 (빈 모달이 열리지 않도록)
  if (sections.length === 0 && metrics.length === 0) return undefined
  return { sections, ...(metrics.length > 0 && { metrics }) }
}

const toHighlights = (v: Maybe<Maybe<Loose<Highlight>>[]>): Highlight[] =>
  list(v)
    .map((h) => ({ text: req(h.text), detail: toDetail(h.detail) }))
    .filter((h) => h.text)

// ── 내용 ─────────────────────────────────────────────────────

type ProfileJson = Loose<{
  name: string
  role: string
  /** 첫 화면 한 줄 소개 — 무엇을 하는 개발자인지 */
  headline: string
  /** About 제목 아래에 두는 좌우명 */
  motto: string
  intro: string[]
  /** About 아래 글머리 목록 — 일하는 방식 */
  habits: string[]
  location: string
  email: string
  resumeUrl: string
  socials: SocialLink[]
  heroMetrics: HeroMetric[]
}>

// 타입을 붙여 대입해야 JSON 구조가 어긋났을 때 빌드가 실패합니다 (as 캐스트 금지)
const profileData: ProfileJson = profileJson
const p = profileData ?? {}

export const profile = {
  name: req(p.name),
  role: req(p.role),
  headline: req(p.headline),
  motto: opt(p.motto),
  intro: lines(p.intro),
  habits: lines(p.habits),
  location: opt(p.location),
  email: req(p.email),
  resumeUrl: opt(p.resumeUrl),
}

/** 주소가 비어 있는 링크는 렌더하지 않습니다 */
export const socials: SocialLink[] = list(p.socials)
  .map((s) => ({ label: req(s.label), href: req(s.href) }))
  .filter((s) => s.label && s.href)

export const heroMetrics: HeroMetric[] = list(p.heroMetrics)
  .map((m) => ({ value: req(m.value), label: req(m.label), source: req(m.source) }))
  .filter((m) => m.value && m.label)

export const skills: SkillGroup[] = list<Loose<SkillGroup>>(skillsJson)
  .map((g) => ({ category: req(g.category), items: lines(g.items) }))
  .filter((g) => g.category && g.items.length > 0)

export const experiences: Experience[] = list<Loose<Experience>>(experiencesJson).map(
  (e) => ({
    company: req(e.company),
    role: req(e.role),
    period: req(e.period),
    summary: req(e.summary),
    positions: list(e.positions)
      .map((po) => ({
        team: req(po.team),
        role: req(po.role),
        period: req(po.period),
        summary: opt(po.summary),
        highlights: toHighlights(po.highlights),
        stack: lines(po.stack),
      }))
      .filter((po) => po.team || po.role),
    highlights: toHighlights(e.highlights),
    stack: lines(e.stack),
    detail: toDetail(e.detail),
  }),
)

export const projects: Project[] = list<Loose<Project>>(projectsJson).map((pr) => ({
  title: req(pr.title),
  period: req(pr.period),
  description: req(pr.description),
  points: toHighlights(pr.points),
  stack: lines(pr.stack),
  repoUrl: opt(pr.repoUrl),
  liveUrl: opt(pr.liveUrl),
  featured: pr.featured === true,
  detail: toDetail(pr.detail),
}))

export const posts: Post[] = list<Loose<Post>>(postsJson)
  .map((po) => ({
    title: req(po.title),
    url: req(po.url),
    date: opt(po.date),
    excerpt: opt(po.excerpt),
  }))
  .filter((po) => po.title)

export const others: OtherItem[] = list<Loose<OtherItem>>(othersJson).map((o) => ({
  title: req(o.title),
  issuer: req(o.issuer),
  date: req(o.date),
  note: opt(o.note),
}))
