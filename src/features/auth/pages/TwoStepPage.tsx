import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEMO_EMAIL } from '../api/auth.mock'
import { AuthButton } from '../components/AuthButton'
import { AuthHeading, BackLink } from '../components/AuthHeading'
import { AuthLayout } from '../components/AuthLayout'
import { Checkbox } from '../components/Checkbox'
import { OtpInput } from '../components/OtpInput'
import { TextField } from '../components/TextField'
import { useAuth } from '../hooks/useAuth'
import { resolveFrom, useAuthFlowState, useSendSmsCode, useVerifyTwoStep } from '../hooks/useAuthFlow'
import type { AuthFlowState } from '../types'

const CODE_LENGTH = 6
const SMS_COOLDOWN_S = 30

/** Figma "Admin Auth 03 · Two-Step Verification". */
export default function TwoStepPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const flow = useAuthFlowState()
  const email = flow.email ?? DEMO_EMAIL
  const challengeId = flow.challengeId ?? 'demo'

  const [mode, setMode] = useState<'app' | 'backup'>('app')
  const [code, setCode] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [trustDevice, setTrustDevice] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [smsCooldown, setSmsCooldown] = useState(0)

  const verify = useVerifyTwoStep()
  const sms = useSendSmsCode()

  useEffect(() => {
    if (smsCooldown <= 0) return
    const t = setTimeout(() => setSmsCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [smsCooldown])

  const submit = (value: string) => {
    setLocalError(null)
    verify.mutate(
      { challengeId, code: value, trustDevice },
      {
        onSuccess: (user) => {
          signIn(user)
          navigate(resolveFrom(flow.from), { replace: true })
        },
      },
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'app' && code.length < CODE_LENGTH) {
      setLocalError(`Enter all ${CODE_LENGTH} digits.`)
      return
    }
    if (mode === 'backup' && !backupCode.trim()) {
      setLocalError('Enter one of your backup codes.')
      return
    }
    submit(mode === 'app' ? code : backupCode)
  }

  const error = localError ?? (verify.error ? verify.error.message : null)

  return (
    <AuthLayout>
      <BackLink state={{ from: flow.from, email } satisfies AuthFlowState} />
      <AuthHeading
        icon="auth-shield"
        title="Two-step verification"
        subtitle={
          mode === 'app'
            ? `Enter the 6-digit code from your authenticator app for ${email}.`
            : `Enter one of the backup codes you saved when you set up 2-step verification for ${email}.`
        }
      />

      <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-6">
        {mode === 'app' ? (
          <div className="flex w-full flex-col gap-2">
            <OtpInput
              value={code}
              length={CODE_LENGTH}
              autoFocus
              invalid={Boolean(verify.error)}
              onChange={(v) => {
                setCode(v)
                setLocalError(null)
                if (verify.isError) verify.reset()
              }}
              onComplete={(v) => !verify.isPending && submit(v)}
            />
            {error && <p className="text-caption font-medium text-cta">{error}</p>}
            {sms.isSuccess && !error && (
              <p className="text-caption font-medium text-muted">
                We texted a code to {sms.data.sentTo}.
              </p>
            )}
          </div>
        ) : (
          <TextField
            label="Backup code"
            icon="auth-key"
            autoFocus
            autoComplete="one-time-code"
            placeholder="XXXXX-XXXX"
            value={backupCode}
            onChange={(e) => {
              setBackupCode(e.target.value)
              setLocalError(null)
              if (verify.isError) verify.reset()
            }}
            error={error ?? undefined}
          />
        )}

        <Checkbox checked={trustDevice} onChange={setTrustDevice} label="Trust this device for 30 days" />

        <AuthButton type="submit" variant="primary" disabled={verify.isPending}>
          {verify.isPending ? 'Verifying…' : 'Verify'}
        </AuthButton>
      </form>

      <div className="flex w-full items-center justify-center gap-4 text-body font-semibold">
        <button
          type="button"
          className="text-cta hover:underline"
          onClick={() => {
            setMode((m) => (m === 'app' ? 'backup' : 'app'))
            setLocalError(null)
            verify.reset()
          }}
        >
          {mode === 'app' ? 'Use a backup code' : 'Use authenticator app'}
        </button>
        <span className="text-subtle">·</span>
        <button
          type="button"
          className="text-cta enabled:hover:underline disabled:text-subtle disabled:cursor-not-allowed"
          disabled={sms.isPending || smsCooldown > 0}
          onClick={() =>
            sms.mutate(challengeId, {
              onSuccess: () => {
                setSmsCooldown(SMS_COOLDOWN_S)
                setMode('app')
              },
            })
          }
        >
          {sms.isPending
            ? 'Sending…'
            : smsCooldown > 0
              ? `Resend SMS (0:${String(smsCooldown).padStart(2, '0')})`
              : 'Send code by SMS'}
        </button>
      </div>
    </AuthLayout>
  )
}
