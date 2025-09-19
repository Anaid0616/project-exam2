'use client';
import * as React from 'react';
import { decodeJwt } from '@/components/utils';

type Ctx = { email: string | null; ready: boolean };
const UserCtx = React.createContext<Ctx>({ email: null, ready: false });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<Ctx>({ email: null, ready: false });
  React.useEffect(() => {
    const t = localStorage.getItem('token');
    const p = t ? decodeJwt(t) : null;
    setState({ email: p?.email ?? null, ready: true });
  }, []);
  return <UserCtx.Provider value={state}>{children}</UserCtx.Provider>;
}

export function useUser() {
  return React.useContext(UserCtx);
}
