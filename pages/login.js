import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const { error } = router.query
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if already logged in
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data.user) router.push('/')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router])

  if (checking) return null

  const errorMessage = error === 'AccessDenied'
    ? 'Access restricted to @ambizmedia.com accounts. Please sign in with your work email.'
    : error
    ? 'Something went wrong. Please try again.'
    : null

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .card {
          background: #fafaf8;
          border: 1px solid rgba(24,36,58,0.12);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 380px;
          text-align: center;
        }
        .logo { font-size: 28px; font-weight: 500; color: #18243a; letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .logo span { color: #3abff8; }
        .tool-name { font-size: 12px; font-family: 'DM Mono', monospace; color: #9aa0ad; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2rem; }
        .divider { border: none; border-top: 1px solid rgba(24,36,58,0.1); margin: 0 0 2rem; }
        .signin-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 11px 20px; background: #18243a; color: #fff;
          border: none; border-radius: 8px; font-family: inherit; font-size: 14px;
          font-weight: 500; cursor: pointer; transition: background 0.15s; text-decoration: none;
        }
        .signin-btn:hover { background: #1e2d48; }
        .note { font-size: 12px; color: #9aa0ad; margin-top: 1rem; line-height: 1.5; }
        .error-msg { font-size: 13px; color: #c0392b; background: #fff5f5; border: 1px solid #fcc; border-radius: 8px; padding: 10px 14px; margin-bottom: 1.25rem; line-height: 1.5; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div className="card">
        <div className="logo">nmp<span>.</span></div>
        <div className="tool-name">Image Prompt Tool</div>
        <hr className="divider" />

        {errorMessage && <div className="error-msg">{errorMessage}</div>}

        <a className="signin-btn" href="/api/auth/login">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </a>

        <p className="note">Access restricted to @ambizmedia.com accounts.</p>
      </div>
    </>
  )
}
