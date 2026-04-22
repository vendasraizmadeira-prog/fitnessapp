import { DefaultSession, DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      isPaid: boolean
    } & DefaultSession['user']
  }

  interface User {
    role: string
    isPaid: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    isPaid: boolean
  }
}
