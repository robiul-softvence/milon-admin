import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_EMAIL } from '../api/auth.mock'
import { AuthButton } from '../components/AuthButton'
import { AuthHeading } from '../components/AuthHeading'
import { AuthLayout } from '../components/AuthLayout'
import { Banner } from '../components/Banner'
import { Checkbox } from '../components/Checkbox'
import { RevealToggle, TextField } from '../components/TextField'
import { useAuthFlowState, useSignInWithGoogle, useSignInWithPassword } from '../hooks/useAuthFlow'
import { signInSchema, type SignInValues } from '../schemas'
import { AuthError, type AuthFlowState, type TwoStepChallenge } from '../types'

/** Figma "Admin Auth 01 · Sign In" + "Admin Auth 02 · Sign In — Error". */
export default function SignInPage() {
  const navigate = useNavigate()
  const flow = useAuthFlowState()
  const [showPassword, setShowPassword] = useState(false)
  const passwordSignIn = useSignInWithPassword()
  const googleSignIn = useSignInWithGoogle()

  const { register, control, handleSubmit, formState, watch } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: flow.email ?? DEMO_EMAIL, password: '', keepSignedIn: true },
  })

  const toTwoStep = (challenge: TwoStepChallenge) =>
    navigate('/two-step', {
      state: { from: flow.from, email: challenge.email, challengeId: challenge.challengeId } satisfies AuthFlowState,
    })

  const onSubmit = handleSubmit((values) => {
    googleSignIn.reset()
    passwordSignIn.mutate(values, { onSuccess: toTwoStep })
  })

  const authError = passwordSignIn.error instanceof AuthError ? passwordSignIn.error : null
  const busy = passwordSignIn.isPending || googleSignIn.isPending
  const { errors } = formState

  return (
    <AuthLayout>
      <AuthHeading title="Welcome back" subtitle="Sign in to the MILON admin console." />

      {authError ? (
        <Banner tone="error" title={authError.code === 'locked' ? 'Account temporarily locked' : authError.message}>
          {authError.code === 'locked'
            ? authError.message
            : `${authError.attemptsLeft} ${authError.attemptsLeft === 1 ? 'attempt' : 'attempts'} left before your account is locked for 15 minutes.`}
        </Banner>
      ) : (
        <>
          {flow.notice && <Banner tone="success" title={flow.notice} />}
          <button
            type="button"
            disabled={busy}
            onClick={() => googleSignIn.mutate(undefined, { onSuccess: toTwoStep })}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-line bg-white py-3.5 transition-colors hover:bg-pearl disabled:opacity-60"
          >
            <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-pearl text-caption font-extrabold text-ink">
              G
            </span>
            <span className="text-[15px] leading-[21px] font-bold text-ink">
              {googleSignIn.isPending ? 'Connecting…' : 'Continue with Google Workspace'}
            </span>
          </button>
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-caption font-medium text-subtle">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-6">
        <TextField
          label="Work email"
          icon="auth-mail"
          type="email"
          autoComplete="username"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <TextField
          label="Password"
          icon="auth-lock"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
          labelAction={
            <Link
              to="/forgot-password"
              state={{ email: watch('email'), from: flow.from } satisfies AuthFlowState}
              className="text-cta hover:underline"
            >
              Forgot password?
            </Link>
          }
          trailing={<RevealToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          error={errors.password?.message ?? (authError?.code === 'invalid_credentials' ? 'Check your password and try again.' : undefined)}
          {...register('password')}
        />

        <Controller
          control={control}
          name="keepSignedIn"
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={field.onChange} label="Keep me signed in for 7 days" />
          )}
        />

        <AuthButton type="submit" variant="primary" disabled={busy}>
          {passwordSignIn.isPending ? 'Signing in…' : 'Sign In'}
        </AuthButton>
      </form>

      {!authError && (
        <p className="w-full text-caption font-medium text-muted">
          Access is limited to invited team members. Need access? Contact your workspace owner.
        </p>
      )}
    </AuthLayout>
  )
}
