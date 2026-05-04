import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard({ session }) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState({
    store_context: '',
    welcome_message: '',
    widget_color: '#2563eb'
  })

  useEffect(() => {
    loadStore()
  }, [])

  async function loadStore() {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (data) {
      setStore(data)
      setForm({
        store_context: data.store_context || '',
        welcome_message: data.welcome_message || '',
        widget_color: data.widget_color || '#2563eb'
      })
    }
    setLoading(false)
  }

  async function loadConversations() {
    if (!store) return
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('store_id', store.id)
      .order('started_at', { ascending: false })
      .limit(50)
    setConversations(data || [])
  }

  async function loadMessages(convId) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setSelectedConv(convId)
  }

  useEffect(() => {
    if (activeTab === 'conversations') loadConversations()
  }, [activeTab, store])

  async function saveSettings() {
    setSaving(true)
    setSaveMsg('')
    const { error } = await supabase
      .from('stores')
      .update({
        store_context: form.store_context,
        welcome_message: form.welcome_message,
        widget_color: form.widget_color
      })
      .eq('id', store.id)

    if (error) {
      setSaveMsg('Error saving. Please try again.')
    } else {
      setSaveMsg('Saved successfully!')
      setStore(prev => ({ ...prev, ...form }))
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (loading) return (
    <div style={s.loading}>Loading your dashboard...</div>
  )

  if (!store) return (
    <div style={s.loading}>Store not found. Please contact support.</div>
  )

  const widgetCode = `<script src="${import.meta.env.VITE_API_URL}/static/widget.js" data-api-key="${store.api_key}"></script>`

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>🛒 Shopkeeper</div>
        <div style={s.storeName}>{store.name}</div>
        <nav>
          {['overview', 'setup', 'conversations', 'customize'].map(tab => (
            <div
              key={tab}
              style={{ ...s.navItem, ...(activeTab === tab ? s.navActive : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'setup' && '⚙️ Bot Setup'}
              {tab === 'conversations' && '💬 Conversations'}
              {tab === 'customize' && '🎨 Customize'}
            </div>
          ))}
        </nav>
        <div style={s.signOut} onClick={signOut}>🚪 Sign out</div>
      </div>

      {/* Main content */}
      <div style={s.main}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={s.pageTitle}>Overview</h2>
            <p style={s.pageSub}>Everything you need to get started.</p>

            <div style={s.grid2}>
              <div style={s.statCard}>
                <div style={s.statLabel}>Your API Key</div>
                <div style={s.statValue}>{store.api_key.slice(0, 20)}...</div>
                <button style={s.copyBtn} onClick={() => copyToClipboard(store.api_key)}>
                  Copy full key
                </button>
              </div>
              <div style={s.statCard}>
                <div style={s.statLabel}>Widget status</div>
                <div style={{ ...s.statValue, color: '#16a34a' }}>● Active</div>
                <div style={s.statSub}>Ready to embed on your site</div>
              </div>
            </div>

            <div style={s.section}>
              <div style={s.sectionTitle}>Your widget code</div>
              <p style={s.sectionSub}>Paste this one line before the closing &lt;/body&gt; tag on your website.</p>
              <div style={s.codeBox}>
                <code style={s.code}>{widgetCode}</code>
              </div>
              <button style={s.btn} onClick={() => copyToClipboard(widgetCode)}>
                Copy widget code
              </button>
            </div>

            <div style={s.section}>
              <div style={s.sectionTitle}>Quick start guide</div>
              <div style={s.steps}>
                <div style={s.step}><span style={s.stepNum}>1</span> Go to Bot Setup and describe your store and products</div>
                <div style={s.step}><span style={s.stepNum}>2</span> Copy your widget code above</div>
                <div style={s.step}><span style={s.stepNum}>3</span> Paste it into your website's HTML</div>
                <div style={s.step}><span style={s.stepNum}>4</span> Your AI support is live instantly</div>
              </div>
            </div>
          </div>
        )}

        {/* SETUP TAB */}
        {activeTab === 'setup' && (
          <div>
            <h2 style={s.pageTitle}>Bot Setup</h2>
            <p style={s.pageSub}>Tell your AI everything about your store. The more detail you give, the better it answers.</p>

            <div style={s.section}>
              <div style={s.sectionTitle}>Store information & products</div>
              <p style={s.sectionSub}>Include: store name, what you sell, product names & prices, shipping policy, return policy, store hours, contact info.</p>
              <textarea
                style={s.textarea}
                rows={14}
                placeholder={`Example:\nWe are TechGadgets, an online electronics store.\n\nProducts:\n- Samsung Galaxy S26 Ultra — $1,299 — Best camera phone, 200MP\n- iPhone 16 Pro — $999 — 48MP camera, titanium build\n- MacBook Air M3 — $1,099 — Lightweight, 18hr battery\n\nShipping: Free on orders over $50. 3-5 business days.\nReturns: 30 days, no questions asked.\nSupport email: help@techgadgets.com\nStore hours: 9am-6pm Monday to Friday`}
                value={form.store_context}
                onChange={e => setForm(prev => ({ ...prev, store_context: e.target.value }))}
              />
            </div>

            <div style={s.section}>
              <div style={s.sectionTitle}>Welcome message</div>
              <p style={s.sectionSub}>First message customers see when they open the chat.</p>
              <input
                style={s.input}
                type="text"
                value={form.welcome_message}
                onChange={e => setForm(prev => ({ ...prev, welcome_message: e.target.value }))}
                placeholder="Hi there! How can I help you today?"
              />
            </div>

            {saveMsg && (
              <p style={{ color: saveMsg.includes('Error') ? '#dc2626' : '#16a34a', marginBottom: 12, fontSize: 14 }}>
                {saveMsg}
              </p>
            )}
            <button style={s.btn} onClick={saveSettings} disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}

        {/* CONVERSATIONS TAB */}
        {activeTab === 'conversations' && (
          <div>
            <h2 style={s.pageTitle}>Conversations</h2>
            <p style={s.pageSub}>All customer chats from your widget.</p>

            <div style={s.convLayout}>
              <div style={s.convList}>
                {conversations.length === 0 && (
                  <p style={{ color: '#94a3b8', fontSize: 14, padding: 16 }}>No conversations yet. Once customers chat on your site, they'll appear here.</p>
                )}
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    style={{ ...s.convItem, ...(selectedConv === conv.id ? s.convItemActive : {}) }}
                    onClick={() => loadMessages(conv.id)}
                  >
                    <div style={s.convId}>Session {conv.session_id.slice(0, 8)}...</div>
                    <div style={s.convTime}>{new Date(conv.started_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>

              <div style={s.convMessages}>
                {!selectedConv && (
                  <p style={{ color: '#94a3b8', fontSize: 14, padding: 16 }}>Select a conversation to view messages.</p>
                )}
                {messages.map(msg => (
                  <div key={msg.id} style={{ ...s.msgBubble, ...(msg.role === 'user' ? s.msgUser : s.msgBot) }}>
                    <div style={s.msgRole}>{msg.role === 'user' ? 'Customer' : 'AI'}</div>
                    <div>{msg.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMIZE TAB */}
        {activeTab === 'customize' && (
          <div>
            <h2 style={s.pageTitle}>Customize</h2>
            <p style={s.pageSub}>Match the widget to your brand.</p>

            <div style={s.section}>
              <div style={s.sectionTitle}>Widget color</div>
              <p style={s.sectionSub}>Choose the color of the chat bubble and header.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
  <input
    type="color"
    value={form.widget_color}
    onChange={e => setForm(prev => ({ ...prev, widget_color: e.target.value }))}
    style={{ width: 48, height: 48, border: 'none', borderRadius: 8, cursor: 'pointer' }}
  />
  <input
    type="text"
    value={form.widget_color}
    onChange={e => {
      const val = e.target.value
      if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
        setForm(prev => ({ ...prev, widget_color: val }))
      }
    }}
    style={{ width: 100, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontFamily: 'monospace' }}
    placeholder="#2563eb"
  />
  <div style={{ width: 36, height: 36, borderRadius: '50%', background: form.widget_color }} />
</div>
            </div>

            {saveMsg && (
              <p style={{ color: saveMsg.includes('Error') ? '#dc2626' : '#16a34a', marginBottom: 12, fontSize: 14 }}>
                {saveMsg}
              </p>
            )}
            <button style={s.btn} onClick={saveSettings} disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f8fafc' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' },
  sidebar: { width: 220, background: 'white', borderRight: '1px solid #e2e8f0', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' },
  logo: { fontSize: 18, fontWeight: 600, padding: '0 20px 4px', color: '#1e293b' },
  storeName: { fontSize: 12, color: '#94a3b8', padding: '0 20px 20px' },
  navItem: { padding: '10px 20px', cursor: 'pointer', fontSize: 14, color: '#64748b', borderRadius: 8, margin: '2px 8px', textTransform: 'capitalize' },
  navActive: { background: '#eff6ff', color: '#2563eb', fontWeight: 500 },
  signOut: { marginTop: 'auto', margin: '8px', padding: '10px 12px', cursor: 'pointer', fontSize: 13, color: '#ef4444', borderRadius: 8, border: '1px solid #fee2e2', textAlign: 'center', background: '#fff5f5' },
  main: { marginLeft: 220, flex: 1, padding: '40px 48px', maxWidth: 800 },
  pageTitle: { fontSize: 22, fontWeight: 600, color: '#1e293b', margin: '0 0 4px' },
  pageSub: { fontSize: 14, color: '#64748b', margin: '0 0 28px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 },
  statCard: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: 16, fontWeight: 500, color: '#1e293b', marginBottom: 8 },
  statSub: { fontSize: 12, color: '#94a3b8' },
  copyBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#2563eb' },
  section: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 500, color: '#1e293b', marginBottom: 4 },
  sectionSub: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  codeBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', marginBottom: 12, overflowX: 'auto' },
  code: { fontSize: 12, color: '#1e293b', fontFamily: 'monospace', whiteSpace: 'nowrap' },
  btn: { background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  textarea: { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'sans-serif' },
  steps: { display: 'flex', flexDirection: 'column', gap: 12 },
  step: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151' },
  stepNum: { width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 },
  convLayout: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, height: '60vh' },
  convList: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflowY: 'auto' },
  convItem: { padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' },
  convItemActive: { background: '#eff6ff' },
  convId: { fontSize: 13, fontWeight: 500, color: '#1e293b' },
  convTime: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  convMessages: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 },
  msgBubble: { padding: '10px 14px', borderRadius: 12, maxWidth: '80%', fontSize: 13 },
  msgBot: { background: '#f1f5f9', alignSelf: 'flex-start' },
  msgUser: { background: '#eff6ff', alignSelf: 'flex-end' },
  msgRole: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }
}