export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Check session
  const cookie = req.cookies?.nmp_session
  if (!cookie) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const session = JSON.parse(Buffer.from(cookie, 'base64').toString())
    if (session.exp < Date.now()) return res.status(401).json({ error: 'Session expired' })
  } catch {
    return res.status(401).json({ error: 'Invalid session' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
