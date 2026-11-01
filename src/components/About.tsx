import { profile } from '../data/profile'
import { Section } from './Section'
import { Bullet } from './Bullet'
import { EditableAdd, EditableRemove, EditableText } from '../dev/Editable'
import { BLANK } from '../dev/editor'

export function About() {
  return (
    <Section
      id="about"
      title="About"
      subtitle={
        <EditableText file="profile" path={['motto']}>
          {profile.motto ?? ''}
        </EditableText>
      }
    >
      <div className="space-y-4 leading-relaxed text-neutral-600 dark:text-neutral-300">
        {profile.intro.map((paragraph, i) => (
          <p key={i}>
            <EditableText file="profile" path={['intro', i]}>
              {paragraph}
            </EditableText>
            <EditableRemove file="profile" path={['intro']} index={i} label="문단" />
          </p>
        ))}
        <EditableAdd
          file="profile"
          path={['intro']}
          index={profile.intro.length}
          blank={BLANK.text}
          label="문단"
        />
      </div>

      <ul className="mt-6 space-y-2">
        {profile.habits.map((habit, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
          >
            <Bullet tone="accent" />
            <span>
              <EditableText file="profile" path={['habits', i]}>
                {habit}
              </EditableText>
              <EditableRemove file="profile" path={['habits']} index={i} label="항목" />
            </span>
          </li>
        ))}
      </ul>
      <EditableAdd
        file="profile"
        path={['habits']}
        index={profile.habits.length}
        blank={BLANK.text}
        label="일하는 방식"
      />

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        {(profile.location || import.meta.env.DEV) && (
          <div>
            <dt className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Location
            </dt>
            <dd className="mt-1 text-neutral-700 dark:text-neutral-300">
              <EditableText file="profile" path={['location']}>
                {profile.location ?? ''}
              </EditableText>
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Email
          </dt>
          <dd className="mt-1">
            <a href={`mailto:${profile.email}`} className="link">
              <EditableText file="profile" path={['email']}>
                {profile.email}
              </EditableText>
            </a>
          </dd>
        </div>
      </dl>
    </Section>
  )
}
