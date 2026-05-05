import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={s.page}>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.logo}>🛒 Shopkeeper</div>
        <div style={s.navLinks}>
          <Link to="/login" style={s.navLink}>Sign in</Link>
          <Link to="/register" style={s.navBtn}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>✦ Powered by AI — 100% free to start</div>
          <h1 style={s.heroTitle}>Your store,<br />always open.</h1>
          <p style={s.heroSub}>
            Shopkeeper adds a 24/7 AI support assistant to any online store in 60 seconds.
            No coding. No monthly fees to start. Just paste one line of code.
          </p>
          <div style={s.heroBtns}>
            <Link to="/register" style={s.btnPrimary}>Start for free →</Link>
            <a href="#how" style={s.btnSecondary}>See how it works</a>
          </div>
          <p style={s.heroNote}>No credit card required · Free forever plan available</p>
        </div>

        {/* Widget preview */}
        <div style={s.widgetPreview}>
          <div style={s.previewWindow}>
            <div style={s.previewHeader}>
              <div>
                <div style={s.previewTitle}>Shopkeeper AI</div>
                <div style={s.previewSub}>Ask me anything about our store</div>
              </div>
              <div style={s.previewClose}>✕</div>
            </div>
            <div style={s.previewMessages}>
              <div style={s.previewMsgBot}>Hi there! 👋 How can I help you today?</div>
              <div style={s.previewMsgUser}>What's your return policy?</div>
              <div style={s.previewMsgBot}>We offer a 30-day no questions asked return policy. Just contact us and we'll sort it out right away! 😊</div>
              <div style={s.previewMsgUser}>Do you ship internationally?</div>
              <div style={s.previewTyping}>
                <span style={s.dot1} />
                <span style={s.dot2} />
                <span style={s.dot3} />
              </div>
            </div>
            <div style={s.previewInput}>
              <div style={s.previewInputBox}>Type a message...</div>
              <div style={s.previewSend}>➤</div>
            </div>
          </div>
          <div style={s.previewBubble}>🛒</div>
        </div>
      </section>

      {/* Stats */}
      <section style={s.stats}>
        <div style={s.statItem}><div style={s.statNum}>60s</div><div style={s.statLabel}>Setup time</div></div>
        <div style={s.statDivider} />
        <div style={s.statItem}><div style={s.statNum}>24/7</div><div style={s.statLabel}>Always available</div></div>
        <div style={s.statDivider} />
        <div style={s.statItem}><div style={s.statNum}>100%</div><div style={s.statLabel}>Your store data only</div></div>
        <div style={s.statDivider} />
        <div style={s.statItem}><div style={s.statNum}>$0</div><div style={s.statLabel}>To get started</div></div>
      </section>

      {/* How it works */}
      <section style={s.section} id="how">
        <div style={s.sectionInner}>
          <div style={s.sectionBadge}>How it works</div>
          <h2 style={s.sectionTitle}>Live in 3 simple steps</h2>
          <div style={s.steps}>
            <div style={s.step}>
              <div style={s.stepNum}>1</div>
              <h3 style={s.stepTitle}>Create your account</h3>
              <p style={s.stepDesc}>Sign up free in 30 seconds. No credit card needed.</p>
            </div>
            <div style={s.stepArrow}>→</div>
            <div style={s.step}>
              <div style={s.stepNum}>2</div>
              <h3 style={s.stepTitle}>Describe your store</h3>
              <p style={s.stepDesc}>Tell the AI about your products, policies, and hours. Plain English — no technical skills needed.</p>
            </div>
            <div style={s.stepArrow}>→</div>
            <div style={s.step}>
              <div style={s.stepNum}>3</div>
              <h3 style={s.stepTitle}>Paste one line of code</h3>
              <p style={s.stepDesc}>Copy your unique script tag and paste it into your website. Your AI is live instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ ...s.section, background: '#f8fafc' }}>
        <div style={s.sectionInner}>
          <div style={s.sectionBadge}>Features</div>
          <h2 style={s.sectionTitle}>Everything your store needs</h2>
          <div style={s.features}>
            {[
              { icon: '🤖', title: 'Trained on your store', desc: 'The AI only knows what you tell it. No hallucinated products or wrong prices — ever.' },
              { icon: '💬', title: 'Real conversations', desc: 'Natural chat that remembers context within a conversation. Customers get real answers.' },
              { icon: '📊', title: 'Conversation history', desc: 'See every customer conversation from your dashboard. Spot trends and common questions.' },
              { icon: '🎨', title: 'Fully customizable', desc: 'Match your brand colors. Set your own welcome message. Make it feel like your store.' },
              { icon: '⚡', title: 'Instant responses', desc: 'No waiting. Customers get answers in seconds, any time of day or night.' },
              { icon: '🔌', title: 'Works everywhere', desc: 'Shopify, WooCommerce, custom sites — if it has a body tag, Shopkeeper works on it.' },
            ].map((f, i) => (
              <div key={i} style={s.feature}>
                <div style={s.featureIcon}>{f.icon}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to never miss a customer question again?</h2>
        <p style={s.ctaSub}>Join store owners already using Shopkeeper to support their customers 24/7.</p>
        <Link to="/register" style={s.btnPrimary}>Get started free →</Link>
        <p style={s.ctaNote}>Free to start · No credit card · Live in 60 seconds</p>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>🛒 Shopkeeper</div>
        <p style={s.footerSub}>AI customer support for small stores.</p>
        <p style={s.footerLinks}>
          <Link to="/login" style={s.footerLink}>Sign in</Link>
          {' · '}
          <Link to="/register" style={s.footerLink}>Sign up</Link>
        </p>
        <p style={s.footerCopy}>© 2026 Shopkeeper. Built with ❤️ for small businesses.</p>
      </footer>

    </div>
  )
}

const s = {
  page: { fontFamily: 'sans-serif', color: '#1e293b', overflowX: 'hidden' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 8%', borderBottom: '1px solid #e2e8f0', background: 'white', position: 'sticky', top: 0, zIndex: 100, boxSizing: 'border-box', width: '100%' },
  logo: { fontSize: 20, fontWeight: 600 },
  navLinks: { display: 'flex', alignItems: 'center', gap: 16 },
  navLink: { color: '#64748b', textDecoration: 'none', fontSize: 14 },
  navBtn: { background: '#2563eb', color: 'white', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 8%', gap: 48, background: 'white', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' },
  heroInner: { flex: 1, minWidth: 300, maxWidth: 560 },
  badge: { display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 20, marginBottom: 24 },
  heroTitle: { fontSize: 56, fontWeight: 700, lineHeight: 1.1, margin: '0 0 20px', color: '#0f172a' },
  heroSub: { fontSize: 18, color: '#64748b', lineHeight: 1.7, margin: '0 0 32px' },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  btnPrimary: { background: '#2563eb', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 500 },
  btnSecondary: { background: 'white', color: '#1e293b', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 16, border: '1px solid #e2e8f0' },
  heroNote: { fontSize: 13, color: '#94a3b8', margin: 0 },
  widgetPreview: { position: 'relative', flex: '0 0 340px' },
  previewWindow: { background: 'white', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden', width: 320 },
  previewHeader: { background: '#2563eb', color: 'white', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  previewTitle: { fontSize: 15, fontWeight: 500 },
  previewSub: { fontSize: 12, opacity: 0.8, marginTop: 2 },
  previewClose: { opacity: 0.7, cursor: 'pointer' },
  previewMessages: { padding: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 },
  previewMsgBot: { background: '#f1f5f9', borderRadius: 14, borderBottomLeftRadius: 4, padding: '9px 13px', fontSize: 13, alignSelf: 'flex-start', maxWidth: '80%' },
  previewMsgUser: { background: '#2563eb', color: 'white', borderRadius: 14, borderBottomRightRadius: 4, padding: '9px 13px', fontSize: 13, alignSelf: 'flex-end', maxWidth: '80%' },
  previewTyping: { background: '#f1f5f9', borderRadius: 14, borderBottomLeftRadius: 4, padding: '12px 16px', alignSelf: 'flex-start', display: 'flex', gap: 4, alignItems: 'center' },
  dot1: { width: 7, height: 7, background: '#94a3b8', borderRadius: '50%' },
  dot2: { width: 7, height: 7, background: '#94a3b8', borderRadius: '50%' },
  dot3: { width: 7, height: 7, background: '#94a3b8', borderRadius: '50%' },
  previewInput: { display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0', alignItems: 'center' },
  previewInputBox: { flex: 1, border: '1px solid #e2e8f0', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: '#94a3b8' },
  previewSend: { background: '#2563eb', color: 'white', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 },
  previewBubble: { position: 'absolute', bottom: -20, right: -10, width: 52, height: 52, background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
  stats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, padding: '40px 48px', background: '#0f172a', flexWrap: 'wrap' },
  statItem: { textAlign: 'center', padding: '0 40px' },
  statNum: { fontSize: 36, fontWeight: 700, color: 'white' },
  statLabel: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  statDivider: { width: 1, height: 48, background: '#334155' },
  section: { padding: '80px 48px' },
  sectionInner: { maxWidth: 1000, margin: '0 auto' },
  sectionBadge: { display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 36, fontWeight: 700, margin: '0 0 48px', color: '#0f172a' },
  steps: { display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' },
  step: { flex: 1, minWidth: 200, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '28px 24px' },
  stepNum: { width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 },
  stepTitle: { fontSize: 17, fontWeight: 600, margin: '0 0 8px' },
  stepDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 },
  stepArrow: { fontSize: 24, color: '#cbd5e1', paddingTop: 28 },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
  feature: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '28px 24px' },
  featureIcon: { fontSize: 28, marginBottom: 12 },
  featureTitle: { fontSize: 16, fontWeight: 600, margin: '0 0 8px' },
  featureDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 },
  cta: { background: '#2563eb', padding: '80px 48px', textAlign: 'center' },
  ctaTitle: { fontSize: 36, fontWeight: 700, color: 'white', margin: '0 0 16px' },
  ctaSub: { fontSize: 18, color: '#bfdbfe', margin: '0 0 32px' },
  ctaNote: { fontSize: 13, color: '#93c5fd', marginTop: 16 },
  footer: { background: '#0f172a', padding: '48px', textAlign: 'center' },
  footerLogo: { fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 8 },
  footerSub: { color: '#64748b', fontSize: 14, marginBottom: 16 },
  footerLinks: { marginBottom: 16 },
  footerLink: { color: '#64748b', textDecoration: 'none', fontSize: 14 },
  footerCopy: { color: '#475569', fontSize: 13 },
}