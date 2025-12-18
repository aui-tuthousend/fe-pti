// utils/session.ts
import { useSession } from '@tanstack/react-start/server'
import { SESSION_SECRET } from '@/config/env'

export type User = {
  id: number;
  username: string;
  name: string;
  role: string;
}

export type SessionData = {
  token: string
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
