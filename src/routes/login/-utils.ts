// utils/session.ts
import { useSession } from '@tanstack/react-start/server'
import { SESSION_SECRET } from '@/config/env'

export type User = {
  name: string,
  username: string,
  email: string,
  phone: string,
  role: string,
  token: string
}

export type SessionData = {
  user: User
}

export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: 'app-session',
    password: SESSION_SECRET, // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1,
    },
  })
}
