import type { AdminUser } from './hooks/useAuth'

export interface PasswordCredentials {
  email: string
  password: string
  keepSignedIn: boolean
}

/** Returned after the first factor succeeds; the second factor is still pending. */
export interface TwoStepChallenge {
  challengeId: string
  email: string
}

export interface VerifyTwoStepInput {
  challengeId: string
  code: string
  trustDevice: boolean
}

export interface ResetPasswordInput {
  token: string
  password: string
}

export type AuthErrorCode = 'invalid_credentials' | 'locked' | 'invalid_code' | 'invalid_token'

export class AuthError extends Error {
  readonly code: AuthErrorCode
  /** Remaining password attempts before the account is locked (sign-in only). */
  readonly attemptsLeft?: number

  constructor(code: AuthErrorCode, message: string, attemptsLeft?: number) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.attemptsLeft = attemptsLeft
  }
}

export type { AdminUser }

/** Router state handed between the auth screens. */
export interface AuthFlowState {
  /** Where to land after sign-in (set by AdminLayout's redirect). */
  from?: { pathname: string; search?: string; hash?: string } | string
  email?: string
  challengeId?: string
  notice?: string
}
