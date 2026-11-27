import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Enter your work email.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  keepSignedIn: z.boolean(),
})
export type SignInValues = z.infer<typeof signInSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Enter your work email.').email('Enter a valid email address.'),
})
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

/** Password rules shown under "New password" (order matches Figma). */
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 12 characters', test: (v: string) => v.length >= 12 },
  {
    id: 'case',
    label: 'Upper & lowercase letters',
    test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { id: 'number', label: 'At least one number', test: (v: string) => /\d/.test(v) },
  { id: 'symbol', label: 'At least one symbol', test: (v: string) => /[^A-Za-z0-9\s]/.test(v) },
] as const

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Choose a new password.')
      .refine((v) => PASSWORD_RULES.every((r) => r.test(v)), 'Meet all the password rules below.'),
    confirm: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: "Passwords don't match.",
  })
export type NewPasswordValues = z.infer<typeof newPasswordSchema>
