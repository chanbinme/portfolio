import { profile } from '../data/profile'
import { Section } from './Section'
import { Bullet } from './Bullet'

export function About() {
  return (
    <Section id="about" title="소개">
      <div className="print-stack grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <div className="max-w-2xl space-y-4 text-[1.0625rem] leading-[1.8] text-fg">
          {profile.intro.map((paragraph, i) => (
            <p key={`${i}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>

        {(profile.habits.length > 0 || profile.motto) && (
          <div className="card self-start p-6">
            {profile.habits.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-muted">일하는 방식</h3>
                <ul className="mt-3 space-y-2.5">
                  {profile.habits.map((habit, i) => (
                    <li key={`${i}-${habit}`} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-fg">
                      <Bullet />
                      {habit}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {profile.motto && (
              <blockquote className="motto mt-5 border-l-2 border-primary pl-4 text-[0.9375rem] leading-relaxed text-muted">
                {profile.motto}
              </blockquote>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
