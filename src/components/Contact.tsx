import { profile, socials } from '../data/profile'
import { Section } from './Section'
import { EditableAdd, EditableRemove, EditableText } from '../dev/Editable'
import { BLANK } from '../dev/editor'

export function Contact() {
  // 편집할 때 JSON의 몇 번째 링크인지 알아야 하므로 원래 인덱스를 함께 들고 다닙니다.
  // 주소가 빈 링크는 평소엔 숨기지만, 편집 중에는 채울 수 있게 남깁니다.
  const links = socials
    .map((social, index) => ({ social, index }))
    .filter(({ social }) => social.href || import.meta.env.DEV)

  return (
    <Section
      id="contact"
      title="Contact"
      subtitle="새로운 기회나 협업 제안은 언제든 환영합니다."
    >
      <a
        href={`mailto:${profile.email}`}
        className="inline-block font-mono text-lg text-accent transition-opacity hover:opacity-70 dark:text-accent-dark"
      >
        <EditableText file="profile" path={['email']}>
          {profile.email}
        </EditableText>
      </a>

      {links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          {links.map(({ social, index }) => (
            <span key={index}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100"
              >
                <EditableText file="profile" path={['socials', index, 'label']}>
                  {social.label}
                </EditableText>
              </a>
              {/*
                주소를 함께 보여줍니다 (전화번호처럼 그 자체가 정보인 경우가 있어서).
                화면에서는 https:// · tel: 같은 접두어를 떼고 읽기 좋게, 개발 서버에서는 고칠 수 있게 원문 그대로 둡니다.
              */}
              <span className="ml-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {import.meta.env.DEV ? (
                  <EditableText file="profile" path={['socials', index, 'href']}>
                    {social.href}
                  </EditableText>
                ) : (
                  readableHref(social.href)
                )}
              </span>
              <EditableRemove
                file="profile"
                path={['socials']}
                index={index}
                label="링크"
              />
            </span>
          ))}
        </div>
      )}

      <EditableAdd
        file="profile"
        path={['socials']}
        index={socials.length}
        blank={BLANK.social}
        label="링크"
      />
    </Section>
  )
}

/** 링크 주소를 사람이 읽는 모양으로: https://github.com/x/ → github.com/x, tel:010-… → 010-… */
function readableHref(href: string) {
  return href
    .replace(/^(https?:\/\/|mailto:|tel:)/, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}
