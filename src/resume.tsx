// 이력서 페이지(/portfolio/resume/)의 진입점. 포트폴리오(main.tsx)와 같은 스타일을 씁니다.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './index.css'
import ResumeApp from './ResumeApp.tsx'
import { restoreScroll } from './dev/editor'
import { startAnalytics } from './lib/analytics'

if (import.meta.env.DEV) restoreScroll()

startAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeApp />
  </StrictMode>,
)
