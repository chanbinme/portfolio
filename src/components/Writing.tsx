import { posts } from '../data/profile'
import { Section } from './Section'
import { EditableAdd, EditableRemove, EditableText } from '../dev/Editable'
import { BLANK } from '../dev/editor'

export function Writing() {
  if (posts.length === 0) return null

  return (
    <Section id="writing" title="Writing" subtitle="겪은 문제와 해결 과정을 정리합니다.">
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {posts.map((post, i) => {
          const titleNode = post.url ? (
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100 dark:group-hover:text-accent-dark"
            >
              <EditableText file="posts" path={[i, 'title']}>
                {post.title}
              </EditableText>
            </a>
          ) : (
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              <EditableText file="posts" path={[i, 'title']}>
                {post.title}
              </EditableText>
            </span>
          )

          return (
            <li key={i} className="group py-3 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0">
                  {titleNode}
                  <EditableRemove file="posts" path={[]} index={i} label="글" />
                </span>
                {(post.date || import.meta.env.DEV) && (
                  <time
                    dateTime={post.date}
                    className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400"
                  >
                    {post.date}
                  </time>
                )}
              </div>
              {(post.excerpt || import.meta.env.DEV) && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  <EditableText file="posts" path={[i, 'excerpt']}>
                    {post.excerpt ?? ''}
                  </EditableText>
                </p>
              )}
              {/* 주소는 제목 링크에 이미 걸려 있습니다. 고칠 수 있게 개발 서버에서만 꺼내 둡니다 */}
              {import.meta.env.DEV && (
                <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                  <EditableText file="posts" path={[i, 'url']}>
                    {post.url}
                  </EditableText>
                </p>
              )}
            </li>
          )
        })}
      </ul>
      <EditableAdd
        file="posts"
        path={[]}
        index={posts.length}
        blank={BLANK.post}
        label="글"
      />
    </Section>
  )
}
