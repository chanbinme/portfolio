import { Header, type NavItem } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { OpenSource } from './components/OpenSource'
import { Writing } from './components/Writing'
import { More } from './components/More'
import { Contact } from './components/Contact'
import { openSource, posts, profile, resumeExperiences } from './data/profile'
import { EditToggle } from './dev/Editable'

/**
 * 이력서 페이지. 포트폴리오에서 Projects를 빼고, 경력만 resume.json에서 따로 읽습니다.
 * 나머지(소개·기술·오픈소스·글·학력·활동·연락처)는 포트폴리오와 같은 JSON을 씁니다.
 *
 * 배포할 때 tools/resume-pdf.mjs가 이 페이지를 인쇄해 resume.pdf를 만듭니다.
 * 인쇄 모양은 index.css의 @media print(이력서 기본값)를 따릅니다.
 */
const NAV: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'opensource', label: 'Open Source' },
  { id: 'writing', label: 'Writing' },
  { id: 'more', label: 'More' },
  { id: 'portfolio', label: '포트폴리오', href: import.meta.env.BASE_URL },
].filter(
  (n) =>
    (n.id !== 'opensource' || openSource.length > 0) &&
    (n.id !== 'writing' || posts.length > 0),
)

export default function ResumeApp() {
  return (
    <>
      <Header nav={NAV} />

      <main>
        <Hero variant="resume" />
        <About />
        <Experience items={resumeExperiences} file="resume" />
        <Skills />
        <OpenSource />
        <Writing />
        <More />
        <Contact />
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </footer>

      <EditToggle />
    </>
  )
}
