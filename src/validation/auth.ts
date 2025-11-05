import * as yup from 'yup';
import { InferType } from 'yup';

/** Only allow @stud.noroff.no */
export const NOROFF_EMAIL_RX = /^[A-Za-z0-9._%+-]+@stud\.noroff\.no$/i;

/** Reusable Yup rule for Noroff student emails
 *
 * Transforms to lowercase and trims whitespace
 */
export const noroffEmail = yup
  .string()
  .transform((v) => (v ?? '').trim().toLowerCase())
  .email('Invalid email')
  .required('Email is required')
  .matches(NOROFF_EMAIL_RX, 'Please enter a valid stud.noroff.no address');

/** Login form schema
 *
 * No venueManager field here
 */
export const loginSchema = yup.object({
  email: noroffEmail,
  password: yup.string().required('Password is required'),
});
export type LoginForm = InferType<typeof loginSchema>;

/** Register form schema
 * Includes venueManager boolean field
 *
 */
export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  email: noroffEmail,
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  // Important radio value "true"/"false" -> boolean
  venueManager: yup
    .boolean()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        if (originalValue === 'true') return true;
        if (originalValue === 'false') return false;
      }
      return !!value;
    })
    .default(false),
});
export type RegisterForm = InferType<typeof registerSchema>;
