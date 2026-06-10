const NextAuth = require('next-auth').default
const GoogleProvider = require('next-auth/providers/google').default

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.email?.endsWith('@ambizmedia.com') ?? false
    },
    async session({ session }) {
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

module.exports = NextAuth(authOptions)
module.exports.authOptions = authOptions
