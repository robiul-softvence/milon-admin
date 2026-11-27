import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEMO_EMAIL, DEMO_RESET_TOKEN } from '../api/auth.mock'
import { AuthButton } from '../components/AuthButton'
import { AuthHeading, BackLink } from '../components/AuthHeading'
import { AuthLayout } from '../components/AuthLayout'
import { Banner } from '../components/Banner'
import { useAuthFlowState, useRequestPasswordReset } from '../hooks/useAuthFlow'
import type { AuthFlowState } from '../types'

const RESEND_COOLDOWN_S = 60

/** "alex.martin@example.com" → "a•••••••n@example.com" (fixed-width mask, as in Figma). */
function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!domain || local.length < 2) return email
  return `${local[0]}•••••••${local[local.length - 1]}@${domain}`
}

const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** Figma "Admin Auth 05 · Check Your Email". */
export default function CheckEmailPage() {
  const flow = useAuthFlowState()
  const email = flow.email || DEMO_EMAIL
  const resend = useRequestPasswordReset()
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  return (
    <AuthLayout>
      <BackLink state={{ from: flow.from, email } satisfies AuthFlowState} />
      <AuthHeading
        icon="auth-mail24"
        title="Check your inbox"
        subtitle={`We sent a reset link to ${maskEmail(email)}. It expires in 30 minutes.`}
      />
      <Banner tone="info">
        {resend.isSuccess && cooldown > 0
          ? 'A new link is on its way. Only the most recent link will work.'
          : "Didn't get it? Check your spam folder or make sure you used your work email."}
      </Banner>
      <AuthButton
        variant="outline"
        disabled={cooldown > 0 || resend.isPending}
        className="disabled:opacity-100 disabled:hover:bg-white"
        onClick={() => resend.mutate(email, { onSuccess: () => setCooldown(RESEND_COOLDOWN_S) })}
      >
        {resend.isPending
          ? 'Sending…'
          : cooldown > 0
            ? `Resend Email (${formatCountdown(cooldown)})`
            : 'Resend Email'}
      </AuthButton>

      {/* Mock only (dev builds): stands in for clicking the link in the email. Remove with the real API. */}
      {import.meta.env.DEV && (
        <Link
          to={`/reset-password?token=${DEMO_RESET_TOKEN}`}
          state={{ email, from: flow.from } satisfies AuthFlowState}
          className="w-full text-center text-caption font-medium text-muted underline-offset-2 hover:text-cta hover:underline"
        >
          Demo: open the reset link from the email →
        </Link>
      )}
    </AuthLayout>
  )
}
