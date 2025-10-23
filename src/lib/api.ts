// src/lib/api.ts

import { apiFetch, HttpError } from '@/lib/http';

/**
 * Base API configuration for the Holidaze project.
 * Provides base URLs and typed route constants.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE)
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in .env.local');

export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

/**
 * Centralized API endpoints.
 */
export const API = {
  venues: '/holidaze/venues',
  bookings: '/holidaze/bookings',
  profiles: '/holidaze/profiles',
  auth: '/holidaze/auth',
  login: '/auth/login',
  register: '/auth/register',
} as const;

/**
 * Convenience wrapper for authenticated API calls.
 * Adds Authorization header automatically if a token is available.
 *
 * @template T Expected response type
 * @param {string} path - The relative or absolute API endpoint
 * @param {RequestInit} [init] - Fetch options
 * @returns {Promise<T>} Parsed response
 * @throws {HttpError<T>} When response is not OK
 */
export async function authApi<T>(path: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(path, init, { auth: true });
}

/**
 * Convenience wrapper for public (unauthenticated) API calls.
 *
 * @template T Expected response type
 * @param {string} path - The relative or absolute API endpoint
 * @param {RequestInit} [init] - Fetch options
 * @returns {Promise<T>} Parsed response
 * @throws {HttpError<T>} When response is not OK
 */
export async function publicApi<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  return apiFetch<T>(path, init, { auth: false });
}

export { HttpError };
