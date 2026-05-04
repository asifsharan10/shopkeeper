import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🛒 Shopkeeper</h1>
        <p style={styles.tagline}>Your store, always open.</p>
        <h2 style={styles.title}>Sign in</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p style={styles.switch}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up free</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' },
  card: { background: 'white', borderRadius: 16, padding: '40px 36px', width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { margin: '0 0 4px', fontSize: 24 },
  tagline: { margin: '0 0 24px', color: '#64748b', fontSize: 13 },
  title: { margin: '0 0 20px', fontSize: 20, fontWeight: 500, color: '#1e293b' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  input: { display: 'block', width: '100%', padding: '10px 14px', marginBottom: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '11px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 500 },
  switch: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: 500 }
}