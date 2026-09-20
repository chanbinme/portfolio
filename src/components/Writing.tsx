import { posts } from '../data/profile'
import { Section } from './Section'

export function Writing() {
  return (
    <Section id="writing" title="Writing">
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {posts.map((post) => {
          const titleNode = post.url ? (
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100 dark:group-hover:text-accent-dark"
            >
              {post.title}
            </a>
          ) : (
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {post.title}
            </span>
          )

          return (
            <li key={post.title} className="group py-5 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-4">
                {titleNode}
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-xs text-neutral-400 dark:text-neutral-500"
                >
                  {post.date}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {post.excerpt}
              </p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
