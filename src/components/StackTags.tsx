import { Tag } from './Tag'

export function StackTags({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {stack.map((s, i) => (
        <Tag key={`${i}-${s}`}>{s}</Tag>
      ))}
    </div>
  )
}
