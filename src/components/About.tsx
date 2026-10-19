import { profile } from '../data/profile'
import { Section, order } from './Section'
import { Bullet } from './Bullet'

/** 편지처럼: 1인칭 문단, 일하는 방식, 좌우명, 서명 */
export function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-[40rem] space-y-6 text-body text-ink">
        {profile.intro.map((paragraph, i) => (
          <p key={`${i}-${paragraph}`} className="rise" style={order(2 + i)}>
            {paragraph}
          </p>
        ))}
      </div>

      {profile.habits.length > 0 && (
        <ul className="mt-10 space-y-3">
          {profile.habits.map((habit, i) => (
            <li
              key={`${i}-${habit}`}
              className="rise flex gap-3 text-body text-ink"
              style={order(4 + i)}
            >
              <Bullet />
              {habit}
            </li>
          ))}
        </ul>
      )}

      {profile.motto && (
        <p className="motto rise mt-14 text-lead text-ink" style={order(7)}>
          <mark className="bg-marker px-1 text-marker-ink [box-decoration-break:clone]">
            {profile.motto}
          </mark>
        </p>
      )}

      <p className="signoff rise mt-14" style={order(8)}>
        <span className="block text-lead font-semibold text-ink">{profile.name}</span>
        <span className="mt-1 block text-small text-muted">
          {[profile.role, profile.location].filter(Boolean).join(' · ')} ·{' '}
          <a href={`mailto:${profile.email}`} className="link">
            {profile.email}
          </a>
        </span>
      </p>
    </Section>
  )
}
