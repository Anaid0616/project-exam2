import * as yup from 'yup';
import type { InferType } from 'yup';

/**
 * Login form schema.
 * - Valid email
 * - Password required
 */
export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});
export type LoginForm = InferType<typeof loginSchema>;

/**
 * Register form schema.
 * - Name >= 2 chars
 * - Valid email
 * - Password >= 8 chars
 * - venueManager is boolean (customer = false)
 */
export const registerSchema = yup.object({
  name: yup.string().min(2, 'Name is too short').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Min 8 characters')
    .required('Password is required'),
  venueManager: yup.boolean().default(false),
});
export type RegisterForm = InferType<typeof registerSchema>;
