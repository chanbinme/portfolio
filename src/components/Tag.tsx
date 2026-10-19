type TagProps = {
  children: string
}

/** 기술 이름 */
export function Tag({ children }: TagProps) {
  return <span className="chip">{children}</span>
}
