type TagProps = {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="tag rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
      {children}
    </span>
  )
}
