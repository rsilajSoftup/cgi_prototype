"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
} from "@/lib/preferences/defaults";
import type { AppPreferences } from "@/lib/preferences/types";

type PreferencesContextValue = {
  preferences: AppPreferences;
  setPreferences: (next: AppPreferences) => void;
  updatePreferences: (patch: Partial<AppPreferences>) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (raw) {
        // Restore saved preferences after mount; server render uses defaults.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydrate
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.lang = preferences.locale;
    root.dataset.textSize = preferences.textSize;
    root.dataset.contrast = preferences.contrast;
    root.dataset.simplified = preferences.simplifiedLayout ? "true" : "false";
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      /* ignore */
    }
  }, [preferences, ready]);

  const updatePreferences = useCallback((patch: Partial<AppPreferences>) => {
    setPreferences((current) => ({ ...current, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ preferences, setPreferences, updatePreferences }),
    [preferences, updatePreferences],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
