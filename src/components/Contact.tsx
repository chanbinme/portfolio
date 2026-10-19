import { profile, socials } from '../data/profile'
import { Section } from './Section'
import { CopyButton } from './CopyButton'

export function Contact() {
  const links = socials.filter((s) => s.href)
  return (
    <Section id="contact" title="연락처">
      <div className="card flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[0.9375rem] text-muted">채용·협업 제안은 메일로 연락 주세요.</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <a href={`mailto:${profile.email}`} className="text-xl font-bold text-fg hover:underline sm:text-2xl">
              {profile.email}
            </a>
            <CopyButton value={profile.email} />
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a href={`mailto:${profile.email}`} className="btn btn-primary">
            메일 보내기
          </a>
          <button type="button" onClick={() => window.print()} className="btn btn-outline">
            PDF로 저장
          </button>
          {links.map((s, i) => (
            <a key={`${i}-${s.label}`} href={s.href} target="_blank" rel="noreferrer noopener" className="btn btn-outline">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}
