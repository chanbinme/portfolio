import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 한글 본문 폰트. 사용하는 글자 범위만 나눠 받는 dynamic subset 버전입니다.
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './index.css'
import App from './App.tsx'
import { restoreScroll } from './dev/editor'
import { startAnalytics } from './lib/analytics'

// 인라인 편집으로 저장하면 Vite가 페이지를 다시 불러옵니다.
// 그때 고치던 자리로 스크롤을 되돌립니다 (개발 서버에서만 동작).
if (import.meta.env.DEV) restoreScroll()

// 방문 분석 (settings.json에 사이트 코드가 있을 때만, 배포본에서만)
startAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
