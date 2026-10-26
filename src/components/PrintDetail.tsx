import type { Detail } from '../data/profile'

/**
 * 경력기술서 PDF에만 나오는 상세 본문.
 *
 * 화면에서는 숨기고(index.css의 `.print-detail`), PdfMenu가 인쇄 직전에
 * `<html data-print="career">`를 붙였을 때만 종이에 나옵니다.
 * 모달의 DetailBody는 다크 모드 색을 입고 있어 종이에는 따로 그립니다.
 */
export function PrintDetail({ detail }: { detail: Detail }) {
  const metrics = detail.metrics ?? []

  return (
    <div className="print-detail">
      {metrics.length > 0 && (
        <p className="pd-metrics">
          {metrics.map((m) => `${m.label} ${m.value}`).join(' · ')}
        </p>
      )}

      {detail.sections.map((section, i) => (
        <div key={`${i}-${section.heading}`} className="pd-section">
          <h5 className="pd-heading">{section.heading}</h5>
          {section.list ? (
            <ul>
              {section.body.map((item, j) => (
                <li key={`${j}-${item}`}>{item}</li>
              ))}
            </ul>
          ) : (
            section.body.map((paragraph, j) => <p key={`${j}-${paragraph}`}>{paragraph}</p>)
          )}
        </div>
      ))}
    </div>
  )
}
