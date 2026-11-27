import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: 'grid', end: true },
  { to: '/users', label: 'Users', icon: 'users' },
  { to: '/subscriptions', label: 'Subscriptions', icon: 'card' },
  { to: '/food', label: 'Food & Recipes', icon: 'food' },
  { to: '/exercises', label: 'Exercise Library', icon: 'dumbbell' },
  { to: '/ai-settings', label: 'AI & API Settings', icon: 'spark' },
] as const

const itemBase = 'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-body transition-colors'

interface SidebarProps {
  onSignOut: () => void
  /** Drawer state below `lg`; ignored on desktop where the sidebar is always shown. */
  open: boolean
  onClose: () => void
}

/** Figma "Admin Sidebar" — 264px, white, right border. Off-canvas drawer below lg. */
export function Sidebar({ onSignOut, open, onClose }: SidebarProps) {
  const { user } = useAuth()
  const { pathname } = useLocation()

  // Close the drawer after navigating.
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {/* Mobile/tablet backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-[rgba(17,19,24,0.4)] backdrop-blur-[4px] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh w-[264px] shrink-0 flex-col justify-between overflow-y-auto border-r border-line bg-white px-5 py-7 transition-transform duration-200',
          'lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex w-full flex-col gap-8">
          <div className="flex items-center justify-between px-2">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-muted hover:bg-pearl lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex w-full flex-col gap-1">
            <p className="text-overline text-subtle">MAIN MENU</p>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    itemBase,
                    isActive ? 'bg-peach font-bold text-cta' : 'font-semibold text-ink hover:bg-pearl',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} className={isActive ? 'text-cta' : 'text-muted'} />
                    <span className="min-w-0 flex-1">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex w-full flex-col gap-1">
          {/* Settings has no screen in the Figma file yet. */}
          <button type="button" className={cn(itemBase, 'font-semibold text-ink hover:bg-pearl')}>
            <Icon name="settings" className="text-muted" />
            Settings
          </button>
          <div className="flex w-full items-center gap-3 rounded-2xl bg-pearl p-3">
            <Avatar initials={user?.initials ?? 'AM'} size={40} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-body font-semibold text-ink">{user?.name ?? 'Alex Martin'}</p>
              <p className="text-caption font-medium text-muted">{user?.role ?? 'Super Admin'}</p>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-md text-muted transition-colors hover:text-ink"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
