import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 한글 본문 폰트. 사용하는 글자 범위만 나눠 받는 dynamic subset 버전입니다.
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
