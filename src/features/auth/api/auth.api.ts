import { mockRequest } from '@/lib/api/client'
import { DEMO_ADMIN } from '../hooks/useAuth'
import {
  AuthError,
  type AdminUser,
  type PasswordCredentials,
  type ResetPasswordInput,
  type TwoStepChallenge,
  type VerifyTwoStepInput,
} from '../types'
import {
  DEMO_BACKUP_CODE,
  DEMO_EMAIL,
  DEMO_OTP,
  DEMO_RESET_TOKEN,
  LOCK_MINUTES,
  MAX_ATTEMPTS,
} from './auth.mock'

// In-memory "server" state for the mock.
let attemptsLeft = MAX_ATTEMPTS
let lockedUntil = 0

function newChallenge(email: string): TwoStepChallenge {
  return { challengeId: `chl_${Date.now().toString(36)}`, email }
}

// TODO(api): POST /admin/auth/sign-in
export async function signInWithPassword(input: PasswordCredentials): Promise<TwoStepChallenge> {
  await mockRequest(null)
  if (Date.now() < lockedUntil) {
    throw new AuthError(
      'locked',
      `Too many attempts. Try again in ${LOCK_MINUTES} minutes.`,
      0,
    )
  }
  const ok = input.email.trim().toLowerCase() === DEMO_EMAIL && input.password.length >= 8
  if (!ok) {
    attemptsLeft -= 1
    if (attemptsLeft <= 0) {
      lockedUntil = Date.now() + LOCK_MINUTES * 60_000
      attemptsLeft = MAX_ATTEMPTS
      throw new AuthError('locked', `Too many attempts. Try again in ${LOCK_MINUTES} minutes.`, 0)
    }
    throw new AuthError('invalid_credentials', 'Incorrect email or password', attemptsLeft)
  }
  attemptsLeft = MAX_ATTEMPTS
  return newChallenge(DEMO_EMAIL)
}

// TODO(api): GET /admin/auth/sso/google (OAuth redirect)
export async function signInWithGoogle(): Promise<TwoStepChallenge> {
  await mockRequest(null, 400)
  return newChallenge(DEMO_EMAIL)
}

// TODO(api): POST /admin/auth/two-step/verify
export async function verifyTwoStep(input: VerifyTwoStepInput): Promise<AdminUser> {
  await mockRequest(null)
  const code = input.code.trim().toUpperCase()
  // Mock phase: any 6-digit code (or the demo backup code) is accepted.
  const isSixDigits = /^\d{6}$/.test(code)
  if (!isSixDigits && code !== DEMO_OTP && code !== DEMO_BACKUP_CODE) {
    throw new AuthError('invalid_code', "That code didn't work. Check your app and try again.")
  }
  return mockRequest(DEMO_ADMIN, 0)
}

// TODO(api): POST /admin/auth/two-step/sms
export function sendSmsCode(_challengeId: string): Promise<{ sentTo: string }> {
  return mockRequest({ sentTo: '+33 •• •• •• 42' })
}

// TODO(api): POST /admin/auth/password/forgot
export function requestPasswordReset(email: string): Promise<{ email: string }> {
  // Always succeeds so the endpoint can't be used to probe which emails exist.
  return mockRequest({ email: email.trim() })
}

// TODO(api): POST /admin/auth/password/reset
export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await mockRequest(null)
  if (input.token && input.token !== DEMO_RESET_TOKEN) {
    throw new AuthError('invalid_token', 'This reset link has expired. Request a new one.')
  }
}
