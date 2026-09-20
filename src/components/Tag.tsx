type TagProps = {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="tag rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
      {children}
    </span>
  )
}
