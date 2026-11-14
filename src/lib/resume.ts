// 이력서 페이지(/resume/)와 그 PDF의 주소.
//
// resume.pdf는 배포할 때 tools/resume-pdf.mjs가 이력서 페이지를 인쇄해 만듭니다.
// 개발 서버에는 PDF 파일이 없으므로, 받는 대신 이력서 페이지를 열거나 인쇄 창을 띄웁니다.

import { profile } from '../data/profile'

const BASE = import.meta.env.BASE_URL

export const RESUME_PAGE_URL = `${BASE}resume/`
export const RESUME_PDF_URL = `${BASE}resume.pdf`

/** PDF를 받을 때의 파일 이름 */
export const resumeFileName = () => `${profile.name}_이력서.pdf`
