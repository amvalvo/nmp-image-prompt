export default function handler(req, res) {
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
