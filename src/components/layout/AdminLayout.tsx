import { useCallback, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Logo } from './Logo'
import { Sidebar } from './Sidebar'

/**
 * Authenticated shell: sidebar + scrolling main column (40×32 padding, 24px gap
 * on desktop). Below lg the sidebar becomes a drawer opened from a top bar.
 */
export function AdminLayout() {
  const { isAuthenticated, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  if (!isAuthenticated) return <Navigate to="/sign-in" replace state={{ from: location }} />

  return (
    <div className="flex min-h-screen items-start bg-pearl">
      <Sidebar
        open={menuOpen}
        onClose={closeMenu}
        onSignOut={() => {
          setMenuOpen(false)
          setConfirmSignOut(true)
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile / tablet top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-ink hover:bg-pearl"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Logo className="origin-left scale-[0.8]" />
        </div>

        <main className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmSignOut}
        onClose={() => setConfirmSignOut(false)}
        onConfirm={() => {
          setConfirmSignOut(false)
          signOut()
          navigate('/sign-in', { replace: true })
        }}
        icon="logout-lg"
        title="Sign out of the admin console?"
        description="You'll need your password and 2-step verification code to sign back in."
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
      />
    </div>
  )
}
