import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { AuthButton } from '../components/AuthButton'
import { AuthHeading } from '../components/AuthHeading'
import { AuthLayout } from '../components/AuthLayout'
import { Banner } from '../components/Banner'
import { PasswordStrength } from '../components/PasswordStrength'
import { RevealToggle, TextField } from '../components/TextField'
import { useAuthFlowState, useResetPassword } from '../hooks/useAuthFlow'
import { newPasswordSchema, type NewPasswordValues } from '../schemas'
import type { AuthFlowState } from '../types'

/** Figma "Admin Auth 06 · Set New Password". */
export default function SetNewPasswordPage() {
  const navigate = useNavigate()
  const flow = useAuthFlowState()
  const [params] = useSearchParams()
  const reset = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  })
  const password = watch('password')
  const confirm = watch('confirm')
  const matches = confirm.length > 0 && confirm === password

  const onSubmit = handleSubmit(({ password }) =>
    reset.mutate(
      { token: params.get('token') ?? '', password },
      {
        onSuccess: () =>
          navigate('/sign-in', {
            replace: true,
            state: {
              email: flow.email,
              from: flow.from,
              notice: 'Password updated. Sign in with your new password.',
            } satisfies AuthFlowState,
          }),
      },
    ),
  )

  return (
    <AuthLayout>
      <AuthHeading
        icon="auth-lock24"
        title="Set a new password"
        subtitle="Choose a strong password you don't use anywhere else."
      />
      {reset.error && <Banner tone="error" title={reset.error.message} />}

      <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-6">
        <TextField
          label="New password"
          icon="auth-lock"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          autoFocus
          placeholder="Create a password"
          trailing={<RevealToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          error={formState.errors.password?.message}
          {...register('password', {
            // Re-check the match once the user has already tried to submit.
            deps: formState.isSubmitted ? ['confirm'] : [],
          })}
        />

        <PasswordStrength password={password} />

        <TextField
          label="Confirm password"
          icon="auth-lock"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repeat the password"
          trailing={matches ? <Icon name="auth-check18" size={18} className="text-success" /> : undefined}
          error={formState.errors.confirm?.message}
          {...register('confirm')}
        />

        <AuthButton type="submit" variant="primary" disabled={reset.isPending}>
          {reset.isPending ? 'Updating…' : 'Update Password'}
        </AuthButton>
      </form>
    </AuthLayout>
  )
}
