import * as yup from 'yup';
import type { InferType } from 'yup';

/** Only allow @stud.noroff.no */
export const NOROFF_EMAIL_RX = /^[A-Za-z0-9._%+-]+@stud\.noroff\.no$/i;

/** Reusable Yup rule for Noroff student emails */
export const noroffEmail = yup
  .string()
  .transform((v) => (v ?? '').trim().toLowerCase())
  .email('Invalid email')
  .required('Email is required')
  .matches(NOROFF_EMAIL_RX, 'Please enter a valid stud.noroff.no address');

/**
 * Login form schema.
 * - stud.noroff.no email
 * - Password required
 */
export const loginSchema = yup.object({
  email: noroffEmail,
  password: yup.string().required('Password is required'),
});
export type LoginForm = InferType<typeof loginSchema>;

/**
 * Register form schema.
 * - Name >= 2 chars
 * - stud.noroff.no email
 * - Password >= 8 chars
 * - venueManager boolean
 */
export const registerSchema = yup.object({
  name: yup.string().min(2, 'Name is too short').required('Name is required'),
  email: noroffEmail,
  password: yup
    .string()
    .min(8, 'Min 8 characters')
    .required('Password is required'),
  venueManager: yup.boolean().default(false),
});
export type RegisterForm = InferType<typeof registerSchema>;
