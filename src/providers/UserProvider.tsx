'use client';

import * as React from 'react';
import { decodeJwt } from '@/lib/utils';
import { invariant } from '@/lib/invariant';

/**
 * Shape of the authenticated user context.
 * - `email`: the current user’s email address (or null if signed out)
 * - `ready`: whether the provider has finished initializing
 */
type AuthCtx = {
  email: string | null;
  ready: boolean;
};

/** React Context storing the current user info */
const AuthContext = React.createContext<AuthCtx | null>(null);

/**
 * UserProvider
 *
 * Reads the JWT token from localStorage (client side),
 * decodes it, and exposes the user email through React context.
 *
 * Usage:
 * ```tsx
 * <UserProvider>
 *   <App />
 * </UserProvider>
 * ```
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthCtx>({
    email: null,
    ready: false,
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = token ? decodeJwt(token) : null;
    setState({ email: payload?.email ?? null, ready: true });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

/**
 * useAuth()
 *
 * Hook to access the current authenticated user.
 * Throws a clear error in development if used outside the <UserProvider>.
 *
 * @example
 * ```tsx
 * import { useAuth } from '@/providers/UserProvider';
 * const { email, ready } = useAuth();
 * if (ready && !email) redirect('/login');
 * ```
 */
export function useAuth(): AuthCtx {
  const ctx = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    invariant(ctx, 'useAuth() must be used inside <UserProvider>');
  }
  return ctx ?? { email: null, ready: false };
}

// Alias for useAuth()
export function useUser() {
  return useAuth();
}
