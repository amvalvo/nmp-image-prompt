let activeTab = 'url';
let activeStyle = 'editorial';
let activePalette = 'blues';
let userImage = null;
const logoData = { 1: null, 2: null };

const PALETTES = {
  blues: { mj: 'deep navy #18243a and electric blue #09a7e9 color palette', de: 'using a deep navy (#18243a) and electric blue (#09a7e9) color palette' },
  greens: { mj: 'deep navy #18243a with sage green #6abf8a and mint #a8ddb5 color palette', de: 'using a deep navy (#18243a) base with sage green (#6abf8a) and soft mint (#a8ddb5) — no blues' },
  bluegreen: { mj: 'deep navy #18243a and electric blue #09a7e9 dominant with sage green #6abf8a accents', de: 'using deep navy (#18243a) and electric blue (#09a7e9) as dominant colors, with limited sage green (#6abf8a) accents only' },
  custom: { mj: '', de: '' }
};

function buildStyleStrings(paletteMj, paletteDe) {
  return {
    editorial: {
      mj: 'editorial photomontage collage, duotone color treatment ' + paletteMj + ', vintage archival photography cutouts layered over flat geometric color blocks circles and rectangles, halftone grain texture, mid-century aesthetic, hard cutout edges not soft blending, bold graphic composition, limited 2-3 color palette, high contrast, contemporary magazine editorial style --ar 16:9 --style raw --stylize 200',
      de: 'Create an editorial photomontage collage in a retro-modern style, ' + paletteDe + '. Vintage archival photography cutouts layered over flat geometric color blocks — overlapping circles and rectangles. Halftone grain texture throughout. Hard cutout edges, not soft blending. Mid-century magazine aesthetic. High contrast. 16:9 landscape format.'
    },
    engraving: {
      mj: 'fine-line intaglio engraving style, highly detailed crosshatching and stippling, reminiscent of classical currency and banknote printing, intricate texture built entirely from dense parallel and intersecting lines, no flat fills or gradients, deep contrast through line density alone, 19th century engraved portraiture and architectural illustration, ' + paletteMj + ' ink on cream paper --ar 16:9 --style raw --stylize 150',
      de: 'Fine-line intaglio engraving style, highly detailed crosshatching and stippling, reminiscent of classical currency and banknote printing. Intricate texture built entirely from dense parallel and intersecting lines — no flat fills or gradients. Deep contrast through line density alone. 19th century engraved portraiture precision, ' + paletteDe + ', on warm cream background. 16:9 landscape format.'
    },
    documentary: {
      mj: 'high-contrast editorial photography style, realistic and unembellished, documentary and journalistic in tone, sharp detail with deep shadows, American residential real estate and housing subjects, suburban neighborhoods single-family homes government buildings everyday homeowners, straightforward framing conveying weight and consequence, ' + paletteMj + ', monochromatic or desaturated treatment, natural light, no studio polish --ar 16:9 --style raw --stylize 50',
      de: 'High-contrast editorial photography style, realistic and unembellished, documentary and journalistic in tone. Sharp detail with deep shadows. American residential real estate subjects — suburban neighborhoods, single-family homes, government buildings, homeowners. Straightforward framing conveying weight and consequence, ' + paletteDe + '. Monochromatic or desaturated. Natural light, no studio polish. 16:9 landscape format.'
    }
  };
}

const VARS = [
  { label: 'Variation A — people-focused', mj: 'cutout figures of businesspeople or professionals as focal element, geometric circle behind them,', de: 'Include people as the focal element — professionals, homeowners, or businesspeople — with bold geometric shapes behind them.' },
  { label: 'Variation B — symbolic / architectural', mj: 'symbolic objects and architecture no people, strong geometric color blocking, architectural photography fragment,', de: 'Focus on symbolic objects and architecture — no people. Strong geometric blocking with architectural or aerial photography fragments.' },
  { label: 'Variation C — bold & minimal', mj: 'minimal elements maximum impact, large flat color blocks dominate, single strong photographic detail,', de: 'Extremely minimal composition. A single strong visual detail as the focal point. Maximum impact with minimum elements.' },
];

const SOCIAL_FORMATS = [
  { id: 'linkedin', name: 'LinkedIn / Facebook', ratio: '1.91:1', mjSuffix: '--ar 1.91:1', de: 'Recompose this image for LinkedIn and Facebook (1.91:1 landscape format). Maintain the identical subject, style, colors, and mood. Keep the focal element centered and ensure nothing important is cropped from top or bottom.' },
  { id: 'square', name: 'Instagram Square', ratio: '1:1', mjSuffix: '--ar 1:1', de: 'Recompose this image as a square (1:1 format) for Instagram and Facebook feed. Maintain the identical subject, style, colors, and mood. Center the focal element so nothing important is cropped on either side.' },
  { id: 'portrait', name: 'Instagram Portrait', ratio: '4:5', mjSuffix: '--ar 4:5', de: 'Recompose this image as a vertical portrait (4:5 format) for Instagram feed. Maintain the identical subject, style, colors, and mood. Center the focal element vertically, extending background elements to fill the taller frame.' },
];

function switchTab(tab, el) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-url').style.display = tab === 'url' ? 'block' : 'none';
  document.getElementById('tab-body').style.display = tab === 'body' ? 'block' : 'none';
}
function selectStyle(style, el) {
  activeStyle = style;
  document.querySelectorAll('[data-style]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}
function selectPalette(palette, el) {
  activePalette = palette;
  document.querySelectorAll('[data-palette]').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('custom-palette-inputs').style.display = palette === 'custom' ? 'block' : 'none';
}
function updateHexPreview(n) {
  const val = document.getElementById('hex-' + n).value.trim();
  const isValid = /^#[0-9a-fA-F]{6}$/.test(val);
  const color = isValid ? val : '#cccccc';
  document.getElementById('preview-' + n).style.background = color;
  const swatch = document.getElementById('custom-swatch-' + n);
  if (swatch) swatch.style.background = color;
}
function getCustomPaletteStrings() {
  const c1 = document.getElementById('hex-1').value.trim() || '#18243a';
  const c2 = document.getElementById('hex-2').value.trim();
  return {
    mj: c2 ? c1 + ' and ' + c2 + ' color palette' : c1 + ' color palette',
    de: c2 ? 'using ' + c1 + ' and ' + c2 + ' as the color palette' : 'using ' + c1 + ' as the primary color'
  };
}
function updateCharCount() {
  const len = document.getElementById('input-body').value.length;
  const el = document.getElementById('char-count');
  el.textContent = len.toLocaleString() + ' characters';
  el.className = 'char-count' + (len > 8000 ? ' warn' : '');
  if (len > 8000) el.textContent += ' — will be trimmed to 6,000 characters';
}
function getInput() { return activeTab === 'url' ? document.getElementById('input-url').value.trim() : document.getElementById('input-body').value.trim(); }
function buildContext() {
  const raw = getInput();
  if (!raw) return null;
  if (activeTab === 'body') return 'FULL ARTICLE BODY:\n' + raw.slice(0, 6000);
  if (raw.includes('.com') || raw.includes('http')) {
    try {
      const clean = raw.includes('://') ? raw : 'https://' + raw;
      const url = new URL(clean);
      const slug = url.pathname.split('/').filter(Boolean).pop() || '';
      const topic = slug.replace(/-/g, ' ').replace(/\d{4,}/g, '').trim();
      if (topic.length > 4) return 'URL: ' + raw + '\nURL slug topic: "' + topic + '"';
    } catch(e) {}
  }
  return 'Headline: ' + raw;
}
function buildLogoContext() {
  const logos = [logoData[1], logoData[2]].filter(Boolean);
  if (!logos.length) return '';
  const parts = logos.map((l, i) => 'Company ' + (i + 1) + ': ' + l.description);
  return '\n\nCompany logos to reference:\n' + parts.join('\n') + '\nIncorporate visual references to these companies brand identity — their colors, name typography, or symbolic elements — as part of the composition.';
}
async function generate() {
  const context = buildContext();
  if (!context) { showError('Please enter a URL, headline, or paste the article body first.'); return; }
  let paletteMj, paletteDe;
  if (activePalette === 'custom') { const c = getCustomPaletteStrings(); paletteMj = c.mj; paletteDe = c.de; }
  else { paletteMj = PALETTES[activePalette].mj; paletteDe = PALETTES[activePalette].de; }
  const STYLES = buildStyleStrings(paletteMj, paletteDe);
  const style = STYLES[activeStyle];
  const target = document.getElementById('target').value;
  const numVars = parseInt(document.getElementById('variations').value);
  const btn = document.getElementById('gen-btn');
  const resultsEl = document.getElementById('results');
  const topicEl = document.getElementById('topic-area');
  btn.disabled = true;
  resultsEl.innerHTML = '<div class="loading"><div class="spinner"></div> Reading article and building prompts…</div>';
  topicEl.style.display = 'none';
  try {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1200, messages: [{ role: 'user', content: 'You are an expert art director for NMP (National Mortgage Professional), a B2B financial news publication.\n\nInput: ' + context + buildLogoContext() + '\n\nIdentify the core article topic in one sentence, then write ' + numVars + ' visual subject description' + (numVars > 1 ? 's' : '') + ' (15-25 words each).\n\nRespond EXACTLY in this format:\nTOPIC: [one sentence]\n---\n[subject 1]' + (numVars > 1 ? '\n[subject 2]' : '') + (numVars > 2 ? '\n[subject 3]' : '') }] })
    });
    if (!resp.ok) { const err = await resp.json().catch(() => ({})); throw new Error(err?.error?.message || 'API error ' + resp.status); }
    const data = await resp.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    const topicMatch = text.match(/TOPIC:\s*(.+)/);
    const subjects = (text.split('---')[1] || '').trim().split('\n').map(l => l.trim()).filter(l => l.length > 8).slice(0, numVars);
    if (!subjects.length) throw new Error('Could not parse response — please try again.');
    if (topicMatch) { topicEl.innerHTML = '<div class="topic-pill"><div class="topic-dot"></div> ' + esc(topicMatch[1].trim()) + '</div>'; topicEl.style.display = 'block'; }
    resultsEl.innerHTML = '';
    subjects.forEach((subject, i) => {
      const v = VARS[i] || VARS[0];
      if (target === 'midjourney' || target === 'both') resultsEl.appendChild(makeCard(v.label, 'Midjourney', 'mj', subject + ', ' + v.mj + ' ' + style.mj, i * 0.06));
      if (target === 'dalle' || target === 'both') resultsEl.appendChild(makeCard(v.label, 'DALL-E', 'de', style.de + ' ' + v.de + ' Subject: ' + subject, (i * 0.06) + (target === 'both' ? 0.03 : 0)));
    });
  } catch(e) { showError(e.message || 'Something went wrong.'); } finally { btn.disabled = false; }
}
function buildSocialPrompts(platformKey, originalPrompt) {
  return SOCIAL_FORMATS.map(fmt => {
    let prompt;
    if (platformKey === 'mj') { prompt = originalPrompt.replace(/--ar\s+[\d.:]+/g, '').trim() + ' ' + fmt.mjSuffix; }
    else { prompt = fmt.de + '\n\nOriginal prompt for reference:\n' + originalPrompt; }
    return { ...fmt, prompt };
  });
}
function toggleSocial(btn) {
  btn.classList.toggle('open');
  btn.nextElementSibling.classList.toggle('open');
}
function makeCard(label, platform, platformKey, promptText, delay) {
  const card = document.createElement('div');
  card.className = 'prompt-card';
  card.style.animationDelay = delay + 's';
  const socialFormats = buildSocialPrompts(platformKey, promptText);
  const socialHTML = socialFormats.map(fmt => {
    const escaped = esc(fmt.prompt).replace(/"/g, '&quot;');
    return '<div class="social-format"><div class="social-format-header"><span class="social-format-name">' + esc(fmt.name) + '<span class="social-ratio-badge">' + esc(fmt.ratio) + '</span></span></div><div class="social-prompt-text">' + esc(fmt.prompt) + '</div><div class="social-format-footer"><button class="copy-btn" data-text="' + escaped + '" onclick="copyPrompt(this)">Copy</button></div></div>';
  }).join('');
  card.innerHTML =
    '<div class="prompt-card-header"><span><span class="prompt-variation">' + esc(label) + '</span><span class="prompt-platform platform-' + platformKey + '">' + esc(platform) + '</span></span></div>' +
    '<div class="prompt-body">' + esc(promptText) + '</div>' +
    '<div class="prompt-footer"><button class="copy-btn" data-text="' + esc(promptText).replace(/"/g,'&quot;') + '" onclick="copyPrompt(this)">Copy prompt</button></div>' +
    '<button class="social-toggle" onclick="toggleSocial(this)"><span class="social-toggle-label"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Social media resize prompts — use after generating your image</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>' +
    '<div class="social-panel"><div class="social-panel-inner"><div class="social-note">💡 Found an image you like? Copy one of these follow-up prompts and paste it into ' + esc(platform) + ' along with your generated image to get the same composition in the right size.</div>' + socialHTML + '</div></div>';
  return card;
}
function copyPrompt(btn) {
  const text = btn.getAttribute('data-text').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied'); btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = btn.closest('.social-format') ? 'Copy' : 'Copy prompt'; }, 2500);
  });
}
async function handleLogoUpload(n, event) {
  const file = event.target.files[0]; if (!file) return;
  const slot = document.getElementById('logo-slot-' + n);
  const emptyEl = document.getElementById('logo-empty-' + n);
  const previewEl = document.getElementById('logo-preview-' + n);
  const imgEl = document.getElementById('logo-img-' + n);
  const statusEl = document.getElementById('logo-status-' + n);
  const reader = new FileReader();
  reader.onload = async function(e) {
    imgEl.src = e.target.result;
    emptyEl.style.display = 'none'; previewEl.style.display = 'block'; slot.classList.add('has-logo');
    statusEl.innerHTML = '<span class="logo-status analyzing">Analyzing…</span>';
    const base64 = e.target.result.split(',')[1];
    const mediaType = file.type || 'image/png';
    try {
      const resp = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 300, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } }, { type: 'text', text: 'This is a company logo. Describe it in 1-2 concise sentences for use in an image generation prompt. Focus on: company name, primary colors, any icon or symbol shape, and overall visual style. Be specific and factual. Output only the description.' }] }] }) });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      const description = data.content?.find(b => b.type === 'text')?.text?.trim() || '';
      if (description) { logoData[n] = { base64, mediaType, description }; statusEl.innerHTML = '<span class="logo-status analyzed">✓ ' + esc(description.slice(0, 60)) + (description.length > 60 ? '…' : '') + '</span>'; }
      else throw new Error();
    } catch(err) {
      const fallbackName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      logoData[n] = { base64, mediaType, description: 'company logo for ' + fallbackName };
      statusEl.innerHTML = '<span class="logo-status analyzed">✓ Logo loaded</span>';
    }
  };
  reader.readAsDataURL(file);
}
function removeLogo(n, event) {
  event.stopPropagation(); event.preventDefault();
  logoData[n] = null;
  document.getElementById('logo-slot-' + n).classList.remove('has-logo');
  document.getElementById('logo-empty-' + n).style.display = 'block';
  document.getElementById('logo-preview-' + n).style.display = 'none';
  document.getElementById('logo-status-' + n).innerHTML = '';
  const input = document.getElementById('logo-slot-' + n).querySelector('input[type=file]');
  if (input) input.value = '';
}
function handleDragOver(e) { e.preventDefault(); document.getElementById('wm-drop').classList.add('drag-over'); }
function handleDragLeave() { document.getElementById('wm-drop').classList.remove('drag-over'); }
function handleDrop(e) { e.preventDefault(); document.getElementById('wm-drop').classList.remove('drag-over'); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith('image/')) loadUserImage(file); }
function handleFileSelect(e) { if (e.target.files[0]) loadUserImage(e.target.files[0]); }
function loadUserImage(file) {
  const reader = new FileReader();
  reader.onload = function(e) { const img = new Image(); img.onload = function() { userImage = img; document.getElementById('wm-output').style.display = 'block'; document.getElementById('wm-drop').style.display = 'none'; redrawWatermark(); }; img.src = e.target.result; };
  reader.readAsDataURL(file);
}
function redrawWatermark() {
  if (!userImage) return;
  const opacity = parseInt(document.getElementById('wm-opacity').value) / 100;
  document.getElementById('wm-opacity-val').textContent = Math.round(opacity * 100) + '%';
  const canvas = document.getElementById('wm-canvas');
  canvas.width = userImage.naturalWidth; canvas.height = userImage.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(userImage, 0, 0);
  const wmImg = document.getElementById('wm-img');
  const scale = canvas.width / 1920;
  ctx.globalAlpha = opacity;
  ctx.drawImage(wmImg, 0, 0, 1920 * scale, 1080 * scale);
  ctx.globalAlpha = 1;
}
function downloadWatermarked() {
  const canvas = document.getElementById('wm-canvas');
  const link = document.createElement('a');
  link.download = 'nmp-image-watermarked.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
function showError(msg) { document.getElementById('results').innerHTML = '<div class="error">' + esc(msg) + '</div>'; }
function resetAll() {
  document.getElementById('input-url').value = '';
  document.getElementById('input-body').value = '';
  document.getElementById('results').innerHTML = '';
  document.getElementById('topic-area').style.display = 'none';
  document.getElementById('char-count').textContent = '0 characters';
  document.getElementById('char-count').className = 'char-count';
  [1,2].forEach(n => { logoData[n] = null; document.getElementById('logo-slot-' + n).classList.remove('has-logo'); document.getElementById('logo-empty-' + n).style.display = 'block'; document.getElementById('logo-preview-' + n).style.display = 'none'; });
}
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
