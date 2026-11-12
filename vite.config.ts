import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { contentEditor } from './tools/content-editor.ts'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 사이트(https://chanbinme.github.io/portfolio/)용 하위 경로.
  // 커스텀 도메인이나 사용자 사이트로 옮기면 '/'로 되돌리세요.
  base: '/portfolio/',
  // contentEditor는 개발 서버에서만 동작합니다 (배포본에는 없습니다)
  plugins: [react(), tailwindcss(), contentEditor()],
  resolve: {
    // shadcn/ui 컴포넌트가 쓰는 '@/' 별칭
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
