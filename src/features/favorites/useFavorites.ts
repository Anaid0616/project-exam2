'use client';

import * as React from 'react';

//
const storageKey = (userId?: string | null) =>
  `favorites:v1:${userId ?? 'anon'}`;

function readFromStorage(userId?: string | null): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(userId: string | null | undefined, ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(ids));
}

export function useFavorites(userId?: string | null) {
  const [ids, setIds] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  //
  React.useEffect(() => {
    setIds(readFromStorage(userId));
    setReady(true);
  }, [userId]);

  const has = React.useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = React.useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id];
        writeToStorage(userId, next);
        return next;
      });
    },
    [userId]
  );

  const add = React.useCallback(
    (id: string) => {
      setIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        writeToStorage(userId, next);
        return next;
      });
    },
    [userId]
  );

  const remove = React.useCallback(
    (id: string) => {
      setIds((prev) => {
        if (!prev.includes(id)) return prev;
        const next = prev.filter((x) => x !== id);
        writeToStorage(userId, next);
        return next;
      });
    },
    [userId]
  );

  return { ids, count: ids.length, has, toggle, add, remove, ready };
}
