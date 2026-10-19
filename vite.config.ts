import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 사이트(https://chanbinme.github.io/portfolio/)용 하위 경로.
  // 커스텀 도메인이나 사용자 사이트로 옮기면 '/'로 되돌리세요.
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
  // 푸터의 "최종 업데이트" 날짜. 배포할 때마다 그날 날짜가 들어갑니다 (한국 시간)
  define: {
    __BUILD_DATE__: JSON.stringify(
      new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date())
        .replace(/\.\s?/g, '.')
        .replace(/\.$/, ''),
    ),
  },
})
