import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 사이트(https://chanbinme.github.io/portfolio/)용 하위 경로.
  // 커스텀 도메인이나 사용자 사이트로 옮기면 '/'로 되돌리세요.
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
})
