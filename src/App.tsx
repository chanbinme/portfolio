import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { OpenSource } from './components/OpenSource'
import { Writing } from './components/Writing'
import { More } from './components/More'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Stage } from './components/evidence/Stage'
import { StageProvider } from './components/evidence/StageContext'

/*
 * 넓은 화면은 두 칸: 왼쪽은 읽는 칼럼, 오른쪽은 스크롤해도 제자리에 있는 증거판.
 * 연락 섹션부터는 두 칸을 벗어나 전체 폭을 씁니다.
 */
export default function App() {
  return (
    <StageProvider>
      <Header />

      <main>
        <div className="split lg:grid lg:grid-cols-2 lg:gap-3 lg:px-3">
          <div className="min-w-0">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <OpenSource />
            <Projects />
            <Writing />
            <More />
          </div>

          <aside aria-label="증거판" className="stage sticky top-16 hidden h-[calc(100svh-4.75rem)] bg-surface lg:block">
            <Stage />
          </aside>
        </div>

        <Contact />
      </main>

      <Footer />
    </StageProvider>
  )
}
