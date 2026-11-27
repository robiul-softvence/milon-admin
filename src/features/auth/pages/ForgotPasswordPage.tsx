import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { DEMO_EMAIL } from '../api/auth.mock'
import { AuthButton } from '../components/AuthButton'
import { AuthHeading, BackLink } from '../components/AuthHeading'
import { AuthLayout } from '../components/AuthLayout'
import { TextField } from '../components/TextField'
import { useAuthFlowState, useRequestPasswordReset } from '../hooks/useAuthFlow'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas'
import type { AuthFlowState } from '../types'

/** Figma "Admin Auth 04 · Forgot Password". */
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const flow = useAuthFlowState()
  const request = useRequestPasswordReset()

  const { register, handleSubmit, formState } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: flow.email || DEMO_EMAIL },
  })

  const onSubmit = handleSubmit(({ email }) =>
    request.mutate(email, {
      onSuccess: (res) =>
        navigate('/check-email', { state: { email: res.email, from: flow.from } satisfies AuthFlowState }),
    }),
  )

  return (
    <AuthLayout>
      <BackLink state={{ from: flow.from, email: flow.email } satisfies AuthFlowState} />
      <AuthHeading
        icon="auth-key"
        title="Reset your password"
        subtitle="Enter your work email and we'll send you a secure link to set a new password."
      />
      <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-6">
        <TextField
          label="Work email"
          icon="auth-mail"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="name@company.com"
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <AuthButton type="submit" variant="primary" disabled={request.isPending}>
          {request.isPending ? 'Sending…' : 'Send Reset Link'}
        </AuthButton>
      </form>
    </AuthLayout>
  )
}
