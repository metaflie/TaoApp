import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Footer, RequireAuth } from './components/ui'
import Home from './pages/Home'

// გვერდები ცალ-ცალკე იტვირთება (code splitting) — საწყისი ჩატვირთვა უფრო სწრაფია
const Alphabet = lazy(() => import('./pages/Alphabet'))
const Lessons = lazy(() => import('./pages/Lessons'))
const WordLesson = lazy(() => import('./pages/WordLesson'))
const TheoryLesson = lazy(() => import('./pages/TheoryLesson'))
const Exam = lazy(() => import('./pages/Exam'))
const Dictionary = lazy(() => import('./pages/Dictionary'))
const Progress = lazy(() => import('./pages/Progress'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Profile = lazy(() => import('./pages/Profile'))
const About = lazy(() => import('./pages/About'))
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Signup })))

function NotFound() {
  return (
    <div className="container">
      <div className="panel finish">
        <h1>404</h1>
        <p>გვერდი ვერ მოიძებნა · Page not found</p>
        <Link className="btn btn-blue" to="/">
          მთავარი · Home
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  const bare = pathname === '/login' || pathname === '/signup'

  return (
    <div className="app">
      {!bare && <Navbar />}
      <main className={bare ? 'main bare' : 'main'}>
        <Suspense fallback={<div className="loader" aria-label="loading" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alphabet" element={<Alphabet />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/play/:script" element={<WordLessonKeyed />} />
            <Route path="/lessons/:id" element={<TheoryLesson />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!bare && <Footer />}
    </div>
  )
}

// სხვა დამწერლობაზე გადასვლისას გაკვეთილი თავიდან იწყება
function WordLessonKeyed() {
  const { pathname } = useLocation()
  return <WordLesson key={pathname} />
}
