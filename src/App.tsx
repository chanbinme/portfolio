import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Writing } from './components/Writing'
import { More } from './components/More'
import { Contact } from './components/Contact'
import { profile } from './data/profile'

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Writing />
        <More />
        <Contact />
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </footer>
    </>
  )
}
