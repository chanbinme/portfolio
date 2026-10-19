/** 실제로 바뀐 코드(diff). 줄 앞 +/-로 추가·삭제를 구분합니다. */
export function CodeDiff({ code }: { code: string }) {
  return (
    <pre className="code overflow-hidden rounded-lg border border-line bg-bg py-3 text-fg">
      <code>
        {code.split('\n').map((line, i) => {
          const sign = line[0]
          const tone =
            sign === '+'
              ? 'bg-[color-mix(in_srgb,var(--success)_14%,transparent)]'
              : sign === '-'
                ? 'bg-[color-mix(in_srgb,#dc2626_12%,transparent)] text-muted'
                : ''
          return (
            <span key={i} className={`block px-4 ${tone}`}>
              {line || ' '}
            </span>
          )
        })}
      </code>
    </pre>
  )
}
