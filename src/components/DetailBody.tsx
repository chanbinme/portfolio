import type { Detail } from '../data/profile'
import { Bullet } from './Bullet'
import {
  EditableAdd,
  EditableRemove,
  EditableSet,
  EditableText,
  EditableToggle,
} from '../dev/Editable'
import { BLANK, type ContentFile, type Key } from '../dev/editor'

type DetailBodyProps = {
  detail: Detail
  /** 개발 서버 인라인 편집용 — 이 상세가 들어 있는 파일과 detail까지의 경로 */
  file: ContentFile
  path: Key[]
}

export function DetailBody({ detail, file, path }: DetailBodyProps) {
  const metrics = detail.metrics ?? []

  return (
    <div className="space-y-7">
      {/* 지표가 없어도 편집 중에는 자리를 둬야 추가할 수 있습니다 */}
      {(metrics.length > 0 || import.meta.env.DEV) && (
        <dl className="flex flex-wrap items-start gap-x-10 gap-y-4 rounded-lg bg-neutral-50 px-5 py-4 dark:bg-neutral-800/50">
          {metrics.map((m, i) => (
            <div key={i}>
              <dt className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                <EditableText file={file} path={[...path, 'metrics', i, 'label']}>
                  {m.label}
                </EditableText>
                <EditableRemove
                  file={file}
                  path={[...path, 'metrics']}
                  index={i}
                  label="지표"
                />
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <EditableText file={file} path={[...path, 'metrics', i, 'value']}>
                  {m.value}
                </EditableText>
              </dd>
            </div>
          ))}
          <EditableAdd
            file={file}
            path={[...path, 'metrics']}
            index={metrics.length}
            blank={BLANK.metric}
            label="지표"
          />
        </dl>
      )}

      {detail.sections.map((section, i) => (
        <section key={i}>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <EditableText file={file} path={[...path, 'sections', i, 'heading']}>
              {section.heading}
            </EditableText>
            <EditableRemove
              file={file}
              path={[...path, 'sections']}
              index={i}
              label="섹션"
            />
            <EditableToggle
              file={file}
              path={[...path, 'sections', i, 'list']}
              value={section.list === true}
              label="목록으로"
            />
          </h4>

          {/* list면 항목마다 점을 붙인 목록, 아니면 문단 */}
          {section.list ? (
            <ul className="mt-2.5 space-y-1.5">
              {section.body.map((item, j) => (
                <li
                  key={j}
                  className="flex gap-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  <Bullet />
                  <span>
                    <EditableText
                      file={file}
                      path={[...path, 'sections', i, 'body', j]}
                    >
                      {item}
                    </EditableText>
                    <EditableRemove
                      file={file}
                      path={[...path, 'sections', i, 'body']}
                      index={j}
                      label="항목"
                    />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2.5 space-y-3">
              {section.body.map((paragraph, j) => (
                <p
                  key={j}
                  className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  <EditableText
                    file={file}
                    path={[...path, 'sections', i, 'body', j]}
                  >
                    {paragraph}
                  </EditableText>
                  <EditableRemove
                    file={file}
                    path={[...path, 'sections', i, 'body']}
                    index={j}
                    label="문단"
                  />
                </p>
              ))}
            </div>
          )}

          <EditableAdd
            file={file}
            path={[...path, 'sections', i, 'body']}
            index={section.body.length}
            blank={BLANK.text}
            label={section.list ? '항목' : '문단'}
          />
        </section>
      ))}

      <div className="flex flex-wrap gap-2">
        <EditableAdd
          file={file}
          path={[...path, 'sections']}
          index={detail.sections.length}
          blank={BLANK.section}
          label="섹션"
        />
        <EditableSet file={file} path={path} label="상세 전체 비우기" confirm />
      </div>
    </div>
  )
}
