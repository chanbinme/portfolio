import { posts } from '../data/profile'
import { Section, order } from './Section'

/** 장부형 목록: 줄 사이에 선 없이, 한 줄을 가리키면 나머지가 물러납니다 */
export function Writing() {
  return (
    <Section id="writing" title="Writing" subtitle="개발하며 겪은 문제를 블로그에 정리합니다.">
      <ul className="ledger">
        {posts.map((post, i) => (
          <li key={`${i}-${post.title}`} className="rise" style={order(2 + i)}>
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex min-h-14 items-baseline justify-between gap-6 py-3 text-ink transition-colors"
            >
              <span className="text-body group-hover:underline group-hover:underline-offset-4">
                {post.title}
              </span>
              {post.date ? (
                <time dateTime={post.date} className="shrink-0 text-small text-muted">
                  {post.date}
                </time>
              ) : (
                <span className="shrink-0 text-small text-muted" aria-hidden="true">
                  ↗
                </span>
              )}
            </a>
            {post.excerpt && <p className="-mt-1 pb-3 text-small text-muted">{post.excerpt}</p>}
          </li>
        ))}
      </ul>
    </Section>
  )
}
