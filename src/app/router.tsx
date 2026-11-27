import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'

const OverviewPage = lazy(() => import('@/features/overview/pages/OverviewPage'))
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'))
const SubscriptionsPage = lazy(() => import('@/features/subscriptions/pages/SubscriptionsPage'))
const FoodPage = lazy(() => import('@/features/food/pages/FoodPage'))
const ExercisesPage = lazy(() => import('@/features/exercises/pages/ExercisesPage'))
const AiSettingsPage = lazy(() => import('@/features/ai-settings/pages/AiSettingsPage'))

const SignInPage = lazy(() => import('@/features/auth/pages/SignInPage'))
const TwoStepPage = lazy(() => import('@/features/auth/pages/TwoStepPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const CheckEmailPage = lazy(() => import('@/features/auth/pages/CheckEmailPage'))
const SetNewPasswordPage = lazy(() => import('@/features/auth/pages/SetNewPasswordPage'))

const page = (node: ReactNode) => <Suspense fallback={null}>{node}</Suspense>

export const router = createBrowserRouter([
  // Auth flow (public)
  { path: '/sign-in', element: page(<SignInPage />) },
  { path: '/two-step', element: page(<TwoStepPage />) },
  { path: '/forgot-password', element: page(<ForgotPasswordPage />) },
  { path: '/check-email', element: page(<CheckEmailPage />) },
  { path: '/reset-password', element: page(<SetNewPasswordPage />) },

  // Admin console (requires a session)
  {
    element: <AdminLayout />,
    children: [
      { index: true, element: page(<OverviewPage />) },
      { path: 'users', element: page(<UsersPage />) },
      { path: 'subscriptions', element: page(<SubscriptionsPage />) },
      { path: 'food', element: page(<FoodPage />) },
      { path: 'exercises', element: page(<ExercisesPage />) },
      { path: 'ai-settings', element: page(<AiSettingsPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
