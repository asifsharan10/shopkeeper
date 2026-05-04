import { useState, useEffect } from 'react'
import {Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
      Loading Shopkeeper...
    </div>
  )

  return (
    <Routes>
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!session ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
      <Route path="/settings" element={session ? <Settings session={session} /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App