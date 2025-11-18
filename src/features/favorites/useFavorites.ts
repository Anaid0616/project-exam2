'use client';

import * as React from 'react';

//
// Internal helpers

/**
 * Creates the localStorage key used for storing favorite IDs.
 *
 * @param {string | null | undefined} userId - The current user ID, or null/undefined for anonymous users.
 * @returns {string} A namespaced storage key.
 */
const storageKey = (userId?: string | null) =>
  `favorites:v1:${userId ?? 'anon'}`;

/**
 * Reads the list of favorite venue IDs from localStorage.
 *
 * @param {string | null | undefined} userId - User ID used to scope the stored favorites.
 * @returns {string[]} The list of stored favorite venue IDs (empty if none or on error).
 */
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

/**
 * Writes the list of favorite venue IDs to localStorage.
 *
 * @param {string | null | undefined} userId - User ID used to scope the stored favorites.
 * @param {string[]} ids - List of favorite venue IDs to store.
 */
function writeToStorage(userId: string | null | undefined, ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), JSON.stringify(ids));
}

/**
 * React hook for managing a user's favorite venues.
 *
 * Features:
 * - Stores favorites in localStorage scoped by user ID.
 * - Syncs automatically when `userId` changes.
 * - Provides helper methods (`has`, `toggle`, `add`, `remove`).
 * - Exposes a `ready` flag once data has been read from localStorage.
 *
 * @param {string | null | undefined} userId - Current user ID, or null for anonymous storage.
 * @returns {{
 *   ids: string[];
 *   count: number;
 *   has: (id: string) - boolean;
 *   toggle: (id: string) - void;
 *   add: (id: string) - void;
 *   remove: (id: string) - void;
 *   ready: boolean;
 * }} Favorites state and helper actions.
 */
export function useFavorites(userId?: string | null) {
  const [ids, setIds] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  // Load from localStorage when userId changes
  React.useEffect(() => {
    setIds(readFromStorage(userId));
    setReady(true);
  }, [userId]);

  /** Checks whether a given venue ID is saved. */
  const has = React.useCallback((id: string) => ids.includes(id), [ids]);

  /** Adds or removes a venue ID depending on whether it's already saved. */
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

  /** Saves a venue ID if it isn't already saved. */
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

  /** Removes a venue ID if it is currently saved. */
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
