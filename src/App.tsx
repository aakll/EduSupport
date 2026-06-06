import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import type { Session } from '@supabase/supabase-js'
import NotificationListener from './components/NotificationListener'
import Login from './pages/Login'
import Scholarships from './pages/Scholarships'
import Universities from './pages/Universities'
import Majors from './pages/Majors'
import Opportunities from './pages/Opportunities'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <BrowserRouter>
      {session && <NotificationListener userId={session.user.id} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/majors" element={<Majors />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
