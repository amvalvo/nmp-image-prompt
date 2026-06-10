export default async function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  })
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
