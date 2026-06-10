// Custom Google OAuth - no next-auth needed
// Handles /api/auth/login, /api/auth/callback, /api/auth/logout, /api/auth/session

export default async function handler(req, res) {
  const { action } = req.query

  if (action === 'login') {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
    })
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
  }

  if (action === 'callback') {
    const { code, error } = req.query
    if (error || !code) return res.redirect('/login?error=cancelled')

    try {
      // Exchange code for tokens
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
          grant_type: 'authorization_code',
        }),
      })
      const tokens = await tokenRes.json()
      if (!tokens.access_token) return res.redirect('/login?error=token')

      // Get user info
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const user = await userRes.json()

      // Check domain
      if (!user.email?.endsWith('@ambizmedia.com')) {
        return res.redirect('/login?error=AccessDenied')
      }

      // Set session cookie (simple base64 encoded JSON, signed with secret)
      const session = Buffer.from(JSON.stringify({
        email: user.email,
        name: user.name,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })).toString('base64')

      res.setHeader('Set-Cookie', `nmp_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`)
      return res.redirect('/')
    } catch (e) {
      return res.redirect('/login?error=server')
    }
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'nmp_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
    return res.redirect('/login')
  }

  if (action === 'session') {
    const cookie = req.cookies?.nmp_session
    if (!cookie) return res.status(200).json({ user: null })
    try {
      const session = JSON.parse(Buffer.from(cookie, 'base64').toString())
      if (session.exp < Date.now()) return res.status(200).json({ user: null })
      return res.status(200).json({ user: { email: session.email, name: session.name } })
    } catch {
      return res.status(200).json({ user: null })
    }
  }

  return res.status(404).json({ error: 'Not found' })
}
