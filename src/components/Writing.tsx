import { posts } from '../data/profile'
import { Section } from './Section'

export function Writing() {
  if (posts.length === 0) return null
  return (
    <Section id="writing" title="글" subtitle="개발하며 해결한 문제를 블로그에 정리합니다.">
      <ul className="card divide-y divide-line">
        {posts.map((post, i) => (
          <li key={`${i}-${post.title}`}>
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex min-h-14 items-start justify-between gap-4 px-6 py-4 transition-colors hover:bg-chip sm:px-7"
            >
              <span className="min-w-0">
                <span className="font-medium text-fg group-hover:underline">{post.title}</span>
                {post.excerpt && <span className="mt-1 block text-sm text-muted">{post.excerpt}</span>}
              </span>
              <span className="no-print flex shrink-0 items-center gap-3 pt-0.5 text-sm text-muted">
                {post.date && <time dateTime={post.date}>{post.date}</time>}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
