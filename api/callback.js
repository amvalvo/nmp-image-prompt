export default async function handler(req, res) {
  const { code, error } = req.query
  if (error || !code) return res.redirect('/auth/login?error=cancelled')

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}/auth/callback`,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) return res.redirect('/auth/login?error=token')

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const user = await userRes.json()

    if (!user.email?.endsWith('@ambizmedia.com')) {
      return res.redirect('/auth/login?error=AccessDenied')
    }

    const session = Buffer.from(JSON.stringify({
      email: user.email,
      name: user.name,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })).toString('base64')

    res.setHeader('Set-Cookie', `nmp_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`)
    return res.redirect('/')
  } catch (e) {
    return res.redirect('/auth/login?error=server')
  }
}
