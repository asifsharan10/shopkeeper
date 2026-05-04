import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ storeName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleRegister() {
    if (!form.storeName || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { store_name: form.storeName } }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create store record in our stores table
    if (data.user) {
      const { error: storeError } = await supabase
        .from('stores')
        .insert({
          name: form.storeName,
          email: form.email,
          store_context: '',
          welcome_message: 'Hi there! How can I help you today?',
          widget_color: '#2563eb',
          ai_model: 'groq'
        })

      if (storeError) {
        setError('Account created but store setup failed. Please contact support.')
        setLoading(false)
        return
      }
    }

    setSuccess('Account created! Check your email to confirm, then sign in.')
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🛒 Shopkeeper</h1>
        <p style={styles.tagline}>Your store, always open.</p>
        <h2 style={styles.title}>Create your account</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <input style={styles.input} type="text" placeholder="Store name" value={form.storeName} onChange={e => update('storeName', e.target.value)} />
        <input style={styles.input} type="email" placeholder="Email address" value={form.email} onChange={e => update('email', e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={e => update('password', e.target.value)} />
        <button style={styles.btn} onClick={handleRegister} disabled={loading}>
          {loading ? 'Creating account...' : 'Create free account'}
        </button>
        <p style={styles.switch}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
  success: { background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  input: { display: 'block', width: '100%', padding: '10px 14px', marginBottom: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '11px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 500 },
  switch: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: 500 }
}