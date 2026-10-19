import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { OpenSource } from './components/OpenSource'
import { Skills } from './components/Skills'
import { Writing } from './components/Writing'
import { More } from './components/More'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

/*
 * 순서는 채용 담당자가 보는 순서를 따릅니다:
 * 첫 화면(누구·경력·연락) → 소개 → 경력 → 프로젝트 → 오픈소스 → 기술 → 글 → 활동·교육 → 연락처
 */
export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <OpenSource />
        <Skills />
        <Writing />
        <More />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
