import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface AdminUser {
  name: string
  initials: string
  role: string
  email: string
}

interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  signIn: (user: AdminUser) => void
  signOut: () => void
}

const STORAGE_KEY = 'milon-admin.session'

function readSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AdminUser) : null
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Mock session store. Real auth will replace `signIn`/`signOut` with API calls
 * (token exchange, 2-step verification) — the context shape stays the same.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(readSession)

  const signIn = useCallback((next: AdminUser) => {
    setUser(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — session lives in memory only */
    }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, signIn, signOut }),
    [user, signIn, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/** Demo admin used by the mock sign-in flow (matches the Figma profile card). */
export const DEMO_ADMIN: AdminUser = {
  name: 'Alex Martin',
  initials: 'AM',
  role: 'Super Admin',
  email: 'alex.martin@example.com',
}
