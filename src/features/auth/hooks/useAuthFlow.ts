import { useMutation } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import {
  requestPasswordReset,
  resetPassword,
  sendSmsCode,
  signInWithGoogle,
  signInWithPassword,
  verifyTwoStep,
} from '../api/auth.api'
import type { AuthFlowState } from '../types'

export const useSignInWithPassword = () => useMutation({ mutationFn: signInWithPassword })
export const useSignInWithGoogle = () => useMutation({ mutationFn: signInWithGoogle })
export const useVerifyTwoStep = () => useMutation({ mutationFn: verifyTwoStep })
export const useSendSmsCode = () => useMutation({ mutationFn: sendSmsCode })
export const useRequestPasswordReset = () => useMutation({ mutationFn: requestPasswordReset })
export const useResetPassword = () => useMutation({ mutationFn: resetPassword })

/** Typed access to the router state passed between auth screens. */
export function useAuthFlowState(): AuthFlowState {
  const location = useLocation()
  return (location.state as AuthFlowState | null) ?? {}
}

/** Resolve the post-sign-in destination from `state.from` (falls back to "/"). */
export function resolveFrom(from: AuthFlowState['from']): string {
  if (!from) return '/'
  if (typeof from === 'string') return from.startsWith('/') ? from : '/'
  const path = `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
  return path.startsWith('/sign-in') || path.startsWith('/two-step') ? '/' : path
}
