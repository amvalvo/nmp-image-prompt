import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      setSession(d.user ? { user: d.user } : null)
      setStatus(d.user ? "authenticated" : "unauthenticated")
    }).catch(() => setStatus("unauthenticated"))
  }, [])
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || status === "loading" || !session) return null

  return (
    <>
      <Head>
        <title>NMP Image Prompt Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #18243a; --navy-2: #1e2d48; --navy-3: #243656;
          --blue: #09a7e9; --blue-2: #13b2f6; --blue-3: #3abff8;
          --off-white: #f5f4f0; --warm-white: #fafaf8;
          --border: rgba(24,36,58,0.12); --border-strong: rgba(24,36,58,0.22);
          --text-primary: #18243a; --text-secondary: #5a6478; --text-muted: #9aa0ad;
          --font-sans: 'DM Sans', sans-serif; --font-mono: 'DM Mono', monospace;
          --radius: 8px; --radius-lg: 14px;
        }
        html { font-size: 16px; }
        body { font-family: var(--font-sans); background: var(--off-white); color: var(--text-primary); min-height: 100vh; line-height: 1.6; }
        .header { background: var(--navy); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 100; }
        .header-left { display: flex; align-items: center; gap: 14px; }
        .logo { font-family: var(--font-sans); font-weight: 500; font-size: 22px; color: #fff; letter-spacing: -0.02em; }
        .logo span { color: var(--blue-3); }
        .header-badge { font-size: 11px; font-family: var(--font-mono); color: var(--blue-3); border: 1px solid rgba(58,191,248,0.3); padding: 3px 10px; border-radius: 20px; letter-spacing: 0.06em; }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .user-email { font-size: 12px; font-family: var(--font-mono); color: rgba(255,255,255,0.5); }
        .signout-btn { font-size: 12px; font-family: var(--font-sans); color: rgba(255,255,255,0.6); background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 4px 12px; cursor: pointer; transition: all 0.15s; }
        .signout-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.4); }
        .page { max-width: 900px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }
        .page-title { font-size: 28px; font-weight: 300; color: var(--navy); margin-bottom: 6px; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 15px; color: var(--text-secondary); margin-bottom: 2.5rem; }
        .card { background: var(--warm-white); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 1.25rem; }
        .card-title { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; font-family: var(--font-mono); }
        .tabs { display: flex; gap: 6px; margin-bottom: 1rem; }
        .tab { font-family: var(--font-sans); font-size: 13px; padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border-strong); background: transparent; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
        .tab:hover { background: rgba(24,36,58,0.05); }
        .tab.active { background: var(--navy); color: #fff; border-color: var(--navy); }
        textarea, input[type="text"] { width: 100%; font-family: var(--font-sans); font-size: 14px; color: var(--text-primary); background: #fff; border: 1px solid var(--border-strong); border-radius: var(--radius); padding: 10px 14px; transition: border-color 0.15s, box-shadow 0.15s; display: block; resize: vertical; }
        textarea:focus, input[type="text"]:focus { outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px rgba(9,167,233,0.12); }
        textarea::placeholder, input::placeholder { color: var(--text-muted); }
        .char-count { font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); margin-top: 6px; text-align: right; }
        .char-count.warn { color: #e07c00; }
        .style-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.25rem; }
        .palette-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 0; }
        .style-option { border: 1.5px solid var(--border-strong); border-radius: var(--radius); padding: 12px 14px; cursor: pointer; transition: all 0.15s; background: #fff; text-align: left; }
        .style-option:hover { border-color: var(--blue); background: rgba(9,167,233,0.03); }
        .style-option.active { border-color: var(--navy); background: rgba(24,36,58,0.04); box-shadow: 0 0 0 1px var(--navy); }
        .style-option-name { font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
        .style-option-desc { font-size: 11.5px; color: var(--text-muted); line-height: 1.4; }
        .style-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .palette-swatches { display: flex; gap: 3px; margin-bottom: 6px; }
        .swatch { width: 18px; height: 18px; border-radius: 3px; border: 1px solid rgba(0,0,0,0.08); flex-shrink: 0; }
        .custom-palette-row { display: flex; gap: 8px; align-items: center; margin-top: 10px; flex-wrap: wrap; }
        .hex-input-wrap { display: flex; align-items: center; gap: 6px; }
        .hex-preview { width: 22px; height: 22px; border-radius: 4px; border: 1px solid var(--border-strong); flex-shrink: 0; background: #ccc; }
        .hex-input { width: 100px; font-family: var(--font-mono); font-size: 13px; padding: 6px 10px; }
        .hex-label { font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
        .logo-upload-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .logo-slot { border: 1.5px dashed var(--border-strong); border-radius: var(--radius); background: #fff; position: relative; transition: all 0.15s; min-height: 90px; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
        .logo-slot:hover { border-color: var(--blue); background: rgba(9,167,233,0.03); }
        .logo-slot.has-logo { border-style: solid; border-color: var(--navy); }
        .logo-slot input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .logo-slot-empty { text-align: center; padding: 16px; pointer-events: none; }
        .logo-slot-label { font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px; }
        .logo-preview-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px; width: 100%; pointer-events: none; }
        .logo-preview-img { max-width: 100%; max-height: 56px; object-fit: contain; border-radius: 4px; }
        .logo-remove { position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background: var(--navy); color: #fff; border: none; cursor: pointer; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center; pointer-events: all; z-index: 2; opacity: 0.7; transition: opacity 0.15s; }
        .logo-remove:hover { opacity: 1; }
        .logo-status { font-size: 11px; font-family: var(--font-mono); display: flex; align-items: center; gap: 5px; margin-top: 6px; }
        .logo-status.analyzing { color: var(--blue); }
        .logo-status.analyzed { color: #0f7a4a; }
        .logo-status.error { color: #c0392b; }
        .options-row { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-top: 1.25rem; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 0.04em; text-transform: uppercase; }
        select { font-family: var(--font-sans); font-size: 13px; padding: 7px 32px 7px 12px; border: 1px solid var(--border-strong); border-radius: var(--radius); background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a6478' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center; color: var(--text-primary); appearance: none; cursor: pointer; }
        select:focus { outline: none; border-color: var(--blue); }
        .btn { font-family: var(--font-sans); font-size: 14px; padding: 10px 22px; border-radius: var(--radius); border: 1px solid var(--border-strong); background: transparent; color: var(--text-primary); cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.15s; white-space: nowrap; }
        .btn:hover { background: rgba(24,36,58,0.05); }
        .btn:active { transform: scale(0.98); }
        .btn-primary { background: var(--navy); color: #fff; border-color: var(--navy); font-weight: 500; }
        .btn-primary:hover { background: var(--navy-2); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .btn-ghost { border-color: transparent; color: var(--text-secondary); }
        .btn-ghost:hover { background: rgba(24,36,58,0.05); color: var(--text-primary); }
        .actions { display: flex; gap: 8px; margin-top: 1.25rem; flex-wrap: wrap; }
        .topic-pill { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: var(--navy-2); background: rgba(9,167,233,0.08); border: 1px solid rgba(9,167,233,0.25); border-radius: 20px; padding: 5px 14px; margin-bottom: 1rem; }
        .topic-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }
        .results { display: flex; flex-direction: column; gap: 1rem; }
        .prompt-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; animation: fadeUp 0.25s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .prompt-card:nth-child(2) { animation-delay: 0.06s; }
        .prompt-card:nth-child(3) { animation-delay: 0.12s; }
        .prompt-card:nth-child(4) { animation-delay: 0.18s; }
        .prompt-card:nth-child(5) { animation-delay: 0.24s; }
        .prompt-card:nth-child(6) { animation-delay: 0.30s; }
        .prompt-card-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border); background: rgba(24,36,58,0.02); }
        .prompt-variation { font-size: 11px; font-family: var(--font-mono); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-secondary); }
        .prompt-platform { font-size: 11px; font-family: var(--font-mono); padding: 2px 8px; border-radius: 4px; margin-left: 8px; }
        .platform-mj { background: rgba(9,167,233,0.1); color: #0882b8; }
        .platform-de { background: rgba(24,36,58,0.08); color: var(--navy-2); }
        .prompt-body { padding: 14px 16px; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.7; color: var(--text-primary); white-space: pre-wrap; word-break: break-word; }
        .prompt-footer { padding: 10px 16px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
        .copy-btn { font-family: var(--font-sans); font-size: 12px; padding: 5px 14px; border-radius: 6px; border: 1px solid var(--border-strong); background: #fff; color: var(--text-secondary); cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s; }
        .copy-btn:hover { background: var(--navy); color: #fff; border-color: var(--navy); }
        .copy-btn.copied { background: #0f7a4a; color: #fff; border-color: #0f7a4a; }
        .social-toggle { width: 100%; background: rgba(9,167,233,0.04); border: none; border-top: 1px solid var(--border); padding: 9px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-family: var(--font-sans); font-size: 12px; color: var(--text-secondary); transition: background 0.15s; }
        .social-toggle:hover { background: rgba(9,167,233,0.08); color: var(--text-primary); }
        .social-toggle svg { transition: transform 0.2s; flex-shrink: 0; }
        .social-toggle.open svg { transform: rotate(180deg); }
        .social-toggle-label { display: flex; align-items: center; gap: 7px; }
        .social-panel { display: none; border-top: 1px solid var(--border); background: rgba(9,167,233,0.02); }
        .social-panel.open { display: block; }
        .social-panel-inner { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }
        .social-format { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .social-format-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(24,36,58,0.02); border-bottom: 1px solid var(--border); }
        .social-format-name { font-size: 11px; font-family: var(--font-mono); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
        .social-ratio-badge { font-size: 10px; font-family: var(--font-mono); background: rgba(24,36,58,0.07); color: var(--text-muted); padding: 1px 6px; border-radius: 3px; }
        .social-prompt-text { padding: 10px 12px; font-family: var(--font-mono); font-size: 12px; line-height: 1.65; color: var(--text-primary); white-space: pre-wrap; word-break: break-word; }
        .social-format-footer { padding: 7px 12px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
        .social-note { font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); padding: 8px 12px; background: rgba(24,36,58,0.03); border-radius: var(--radius); line-height: 1.5; }
        .loading { display: flex; align-items: center; gap: 12px; padding: 1.5rem; color: var(--text-secondary); font-size: 14px; }
        .spinner { width: 18px; height: 18px; border: 2px solid var(--border-strong); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.65s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error { padding: 1rem 1.25rem; background: #fff5f5; border: 1px solid #fcc; border-radius: var(--radius); color: #c0392b; font-size: 13.5px; }
        .section-divider { border: none; border-top: 1px solid var(--border); margin: 1.25rem 0; }
        .wm-drop-area { border: 2px dashed var(--border-strong); border-radius: var(--radius); padding: 2rem; text-align: center; cursor: pointer; transition: all 0.15s; background: #fff; position: relative; }
        .wm-drop-area:hover, .wm-drop-area.drag-over { border-color: var(--blue); background: rgba(9,167,233,0.03); }
        .wm-drop-text { font-size: 14px; color: var(--text-muted); }
        .wm-drop-text strong { color: var(--text-secondary); }
        .wm-drop-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .wm-preview-wrap canvas { max-width: 100%; border-radius: var(--radius); display: block; }
        .wm-controls { display: flex; gap: 10px; align-items: center; margin-top: 10px; flex-wrap: wrap; }
        .wm-opacity-label { font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
        input[type=range] { width: 120px; accent-color: var(--navy); cursor: pointer; }
        .step-divider { display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0; }
        .step-divider-line { flex: 1; height: 1px; background: var(--border); }
        .step-divider-text { font-size: 13px; color: var(--text-muted); font-family: var(--font-mono); white-space: nowrap; }
        .footer { text-align: center; font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); padding-top: 2rem; border-top: 1px solid var(--border); margin-top: 3rem; }
        @media (max-width: 640px) {
          .page { padding: 1.5rem 1rem 3rem; }
          .style-grid, .palette-grid { grid-template-columns: 1fr 1fr; }
          .options-row { flex-direction: column; align-items: stretch; }
          .header { padding: 0 1rem; }
          .user-email { display: none; }
        }
      `}</style>

      <header className="header">
        <div className="header-left">
          <div className="logo">nmp<span>.</span></div>
          <div className="header-badge">IMAGE PROMPT TOOL</div>
        </div>
        <div className="header-right">
          <span className="user-email">{session?.user?.email}</span>
          <button className="signout-btn" onClick={() => window.location.href='/api/auth/logout'}>Sign out</button>
        </div>
      </header>

      <main className="page">
        <h1 className="page-title">Image Prompt Generator</h1>
        <p className="page-subtitle">Generate brand-consistent Midjourney and DALL-E prompts for any NMP article, then watermark your image in one click.</p>

        <div className="card">
          <div className="card-title">Article Input</div>
          <div className="tabs">
            <button className="tab active" onClick="switchTab('url', this)">URL or headline</button>
            <button className="tab" onClick="switchTab('body', this)">Full article body</button>
          </div>
          <div id="tab-url">
            <textarea id="input-url" rows="3" placeholder="Paste a nationalmortgageprofessional.com URL or article headline" />
          </div>
          <div id="tab-body" style={{display:'none'}}>
            <textarea id="input-body" rows="12" placeholder="Paste the full article text here…" onInput="updateCharCount()" />
            <div className="char-count" id="char-count">0 characters</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Visual Style</div>
          <div className="style-grid">
            <div className="style-option active" data-style="editorial" onClick="selectStyle('editorial', this)">
              <div className="style-option-name"><span className="style-dot" style={{background:'#09a7e9'}}></span>Editorial Collage</div>
              <div className="style-option-desc">Duotone photomontage with geometric blocks and halftone grain. The NMP signature look.</div>
            </div>
            <div className="style-option" data-style="engraving" onClick="selectStyle('engraving', this)">
              <div className="style-option-name"><span className="style-dot" style={{background:'#2e4164'}}></span>Currency Engraving</div>
              <div className="style-option-desc">Fine-line intaglio crosshatching reminiscent of US banknotes and 19th century illustration.</div>
            </div>
            <div className="style-option" data-style="documentary" onClick="selectStyle('documentary', this)">
              <div className="style-option-name"><span className="style-dot" style={{background:'#18243a'}}></span>Documentary</div>
              <div className="style-option-desc">High-contrast editorial photography. Journalistic, monochromatic, heavy and real.</div>
            </div>
          </div>

          <hr className="section-divider" />
          <div className="card-title" style={{marginBottom:'0.75rem'}}>Color Palette</div>
          <div className="palette-grid">
            <div className="style-option active" data-palette="blues" onClick="selectPalette('blues', this)">
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#18243a'}}></div>
                <div className="swatch" style={{background:'#09a7e9'}}></div>
                <div className="swatch" style={{background:'#3abff8'}}></div>
              </div>
              <div className="style-option-name" style={{fontSize:'12px'}}>Navy Blues</div>
              <div className="style-option-desc">Deep navy + electric blue. The NMP standard.</div>
            </div>
            <div className="style-option" data-palette="greens" onClick="selectPalette('greens', this)">
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#18243a'}}></div>
                <div className="swatch" style={{background:'#6abf8a'}}></div>
                <div className="swatch" style={{background:'#a8ddb5'}}></div>
              </div>
              <div className="style-option-name" style={{fontSize:'12px'}}>Brand Greens</div>
              <div className="style-option-desc">Navy base with sage and mint greens from the brand kit.</div>
            </div>
            <div className="style-option" data-palette="bluegreen" onClick="selectPalette('bluegreen', this)">
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#18243a'}}></div>
                <div className="swatch" style={{background:'#09a7e9'}}></div>
                <div className="swatch" style={{background:'#6abf8a'}}></div>
              </div>
              <div className="style-option-name" style={{fontSize:'12px'}}>Blue + Green</div>
              <div className="style-option-desc">Electric blue dominant with limited green accents.</div>
            </div>
            <div className="style-option" data-palette="custom" onClick="selectPalette('custom', this)">
              <div className="palette-swatches">
                <div className="swatch" id="custom-swatch-1" style={{background:'#cccccc'}}></div>
                <div className="swatch" id="custom-swatch-2" style={{background:'#eeeeee'}}></div>
              </div>
              <div className="style-option-name" style={{fontSize:'12px'}}>Custom</div>
              <div className="style-option-desc">Enter your own 1–2 hex codes below.</div>
            </div>
          </div>

          <div id="custom-palette-inputs" style={{display:'none'}}>
            <div className="custom-palette-row">
              <span className="hex-label">Color 1</span>
              <div className="hex-input-wrap">
                <div className="hex-preview" id="preview-1"></div>
                <input type="text" className="hex-input" id="hex-1" placeholder="#18243a" maxLength="7" onInput="updateHexPreview(1)" />
              </div>
              <span className="hex-label" style={{marginLeft:'8px'}}>Color 2 (optional)</span>
              <div className="hex-input-wrap">
                <div className="hex-preview" id="preview-2"></div>
                <input type="text" className="hex-input" id="hex-2" placeholder="#09a7e9" maxLength="7" onInput="updateHexPreview(2)" />
              </div>
            </div>
          </div>

          <hr className="section-divider" />
          <div className="card-title" style={{marginBottom:'0.75rem'}}>Company Logos <span style={{fontWeight:'400',textTransform:'none',letterSpacing:0,fontSize:'11px',color:'var(--text-muted)',marginLeft:'6px'}}>optional</span></div>
          <div className="logo-upload-row">
            <div className="logo-slot" id="logo-slot-1">
              <input type="file" accept="image/*" onChange="handleLogoUpload(1, event)" />
              <div className="logo-slot-empty" id="logo-empty-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="logo-slot-label">Company logo 1<br/>PNG, JPG, SVG</span>
              </div>
              <div id="logo-preview-1" style={{display:'none', width:'100%'}}>
                <div className="logo-preview-wrap">
                  <img className="logo-preview-img" id="logo-img-1" alt="" />
                  <div id="logo-status-1"></div>
                </div>
                <button className="logo-remove" onClick={(e) => removeLogo(1, e)}>×</button>
              </div>
            </div>
            <div className="logo-slot" id="logo-slot-2">
              <input type="file" accept="image/*" onChange="handleLogoUpload(2, event)" />
              <div className="logo-slot-empty" id="logo-empty-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="logo-slot-label">Company logo 2<br/>PNG, JPG, SVG</span>
              </div>
              <div id="logo-preview-2" style={{display:'none', width:'100%'}}>
                <div className="logo-preview-wrap">
                  <img className="logo-preview-img" id="logo-img-2" alt="" />
                  <div id="logo-status-2"></div>
                </div>
                <button className="logo-remove" onClick={(e) => removeLogo(2, e)}>×</button>
              </div>
            </div>
          </div>

          <hr className="section-divider" />
          <div className="options-row">
            <div className="field">
              <label htmlFor="target">Generate for</label>
              <select id="target">
                <option value="dalle" defaultValue>ChatGPT / DALL-E</option>
                <option value="midjourney">Midjourney</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="variations">Variations</label>
              <select id="variations">
                <option value="3">3 variations</option>
                <option value="2">2 variations</option>
                <option value="1">1 variation</option>
              </select>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-primary" id="gen-btn" onClick="generate()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/></svg>
              Generate prompts
            </button>
            <button className="btn btn-ghost" onClick="resetAll()">Clear</button>
          </div>
        </div>

        <div id="topic-area" style={{display:'none', marginBottom:'0.75rem'}}></div>
        <div id="results"></div>

        <div className="step-divider">
          <div className="step-divider-line"></div>
          <div className="step-divider-text">↑ Copy a prompt, generate your image, then return here to add the watermark ↓</div>
          <div className="step-divider-line"></div>
        </div>

        <div className="card">
          <div className="card-title">Add NMP Watermark to Your Image</div>
          <div className="wm-drop-area" id="wm-drop"
            onDragOver="handleDragOver(event)"
            onDragLeave="handleDragLeave()"
            onDrop="handleDrop(event)">
            <input type="file" className="wm-drop-input" id="wm-file-input" accept="image/*" onChange="handleFileSelect(event)" />
            <div className="wm-drop-text"><strong>Drop your generated image here</strong><br/>or click to browse — PNG, JPG, WEBP supported</div>
          </div>
          <div id="wm-output" style={{display:'none', marginTop:'1rem'}}>
            <div className="wm-preview-wrap">
              <canvas id="wm-canvas"></canvas>
            </div>
            <div className="wm-controls">
              <span className="wm-opacity-label">Watermark opacity</span>
              <input type="range" id="wm-opacity" min="5" max="100" defaultValue="35" onInput="redrawWatermark()" />
              <span id="wm-opacity-val" style={{fontSize:'12px',fontFamily:'var(--font-mono)',color:'var(--text-muted)'}}>35%</span>
              <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick="downloadWatermarked()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download watermarked image
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        Built for NMP · National Mortgage Professional · Brand-consistent editorial imagery
      </footer>

      <img id="wm-img" src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAQ4CAYAAADo08FDAABPb0lEQVR4nOzdfYyueV3f8Q9zZuac2ZOzZ8/uYdms6wMlK0KREkoUJYYYW0uIIfiHQSkkpqFWpWqwT2qb2FaNrbFSU02tGtpaoRoCrZY0hT4QQopWDKEKBUIoiHWzLOzD2cmcOTNnzmz/+F2/XNfczJ6Z2Xn+zuuVTGbmnvvhuq/7uuef9/39Xc966qmnAgAAAAAAAMDpN3fcGwAAAAAAAADAwRCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQgAEAAAAAAACKEIABAAAAAAAAihCAAQAAAAAAAIoQ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AAAAAEAnBMAAAAAAAAAAnRAAAwAAAAAAAHRCAAwAAAAAAADQCQEwAAAAAAAAQCcEwAAAAAAAAACdEAADAAAAAAAAdEIADAAAAAAAANAJATAAAAAAAABAJwTAAAAAAAAAAJ0QAAMAAAAAAAB0QgAMAAAAAAAA0AkBMAAAAAAAAEAnBMAAAAAAAAAAnRAAAwAAAAAAAHRCAAwAAAAAAADQCQEwAAAAAAAAQCcEwAAAAAAAAACdEAADAAAAAAAAdEIADAAAAAAAANAJATAAAAAAAABAJwTAAAAAAAAAAJ0QAAMAAAAAAAB0QgAMAAAAAAAA0AkBMAAAAAAAAEAnBMAAAAAAAAAAnRAAAwAAAAAAAHRCAAwAAAAAAADQCQEwAAAAAAAAQCcEwAAAAAAAAACdEAADAAAAAAAAdEIADAAAAAAAANAJATAAAAAAAABAJwTAAAAAAAAAAJ0QAAMAAAAAAAB0QgAMAAAAAAAA0AkBMAAAAAAAAEAnBMAAAAAAAAAAnRAAAwAAAAAAAHRCAAwAAAAAAADQCQEwAAAAAAAAQCcEwAAAAAAAAACdEAADAAAAAAAAdEIADAAAAAAAANAJATAAAAAAAABAJwTAAAAAAAAAAJ0QAAMAAAAAAAB0QgAMAAAAAAAA0AkBMAAAAAAAAEAnBMAAAAAAAAAAnRAAAwAAAAAAAHRCAAwAAAAAAADQCQEwAAAAAAAAQCcEwAAAAAAAAACdEAADAAAAAAAAdEIADAAAAAAAANCJ/wfNWuGs8R1kdwAAAABJRU5ErkJggg==`} style={{display:'none'}} alt="" crossOrigin="anonymous" />

      <Script src="/tool.js" strategy="afterInteractive" />
    </>
  )
}
