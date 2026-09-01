"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Language } from "@/lib/i18n";
import {
  detectBrowserLanguage,
  LANGUAGE_OPTIONS,
  LANGUAGE_PREFERENCES_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
} from "@/lib/i18n";
import LanguageWelcome from "./LanguageWelcome";

export type LanguagePreferences = {
  primaryLanguage: Language;
  secondaryLanguage: Language;
};

type LanguageContextValue = LanguagePreferences & {
  language: Language;
  hasChosenLanguage: boolean;
  setLanguage: (language: Language, remember?: boolean) => void;
  setPrimaryLanguage: (language: Language, remember?: boolean) => void;
  setSecondaryLanguage: (language: Language, remember?: boolean) => void;
  setLanguagePreferences: (preferences: LanguagePreferences, remember?: boolean) => void;
  swapLanguages: () => void;
  resetToDefault: () => void;
  openLanguagePicker: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function defaultLanguagePreferences(browserLanguage: string): LanguagePreferences {
  const primaryLanguage = detectBrowserLanguage(browserLanguage);
  return {
    primaryLanguage,
    secondaryLanguage: primaryLanguage === "en" ? "zh" : "en",
  };
}

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && LANGUAGE_OPTIONS.some((option) => option.code === value);
}

function isPreferences(value: unknown): value is LanguagePreferences {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LanguagePreferences>;
  return isLanguage(candidate.primaryLanguage) && isLanguage(candidate.secondaryLanguage) && candidate.primaryLanguage !== candidate.secondaryLanguage;
}

function updateDocumentLanguage(language: Language) {
  if (typeof document === "undefined") return;
  const option = LANGUAGE_OPTIONS.find((item) => item.code === language);
  document.documentElement.lang = option?.locale ?? language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<LanguagePreferences>({ primaryLanguage: "zh", secondaryLanguage: "en" });
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    try {
      const browserDefault = defaultLanguagePreferences(window.navigator.language);
      const storedPreferences = window.localStorage.getItem(LANGUAGE_PREFERENCES_STORAGE_KEY);
      const oldStoredLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      let nextPreferences = browserDefault;
      const parsed = storedPreferences ? JSON.parse(storedPreferences) : null;
      if (isPreferences(parsed)) nextPreferences = parsed;
      else if (isLanguage(oldStoredLanguage)) {
        nextPreferences = {
          primaryLanguage: oldStoredLanguage,
          secondaryLanguage: oldStoredLanguage === "en" ? "zh" : "en",
        };
      }
      setPreferencesState(nextPreferences);
      updateDocumentLanguage(nextPreferences.primaryLanguage);
      const hasStoredPreferences = Boolean(storedPreferences || oldStoredLanguage);
      setHasChosenLanguage(hasStoredPreferences);
      setPickerOpen(!hasStoredPreferences);
    } catch {
      setPreferencesState(defaultLanguagePreferences("en-US"));
      updateDocumentLanguage("en");
      setPickerOpen(true);
    }
  }, []);

  const setLanguagePreferences = useCallback((next: LanguagePreferences, remember = true) => {
    if (next.primaryLanguage === next.secondaryLanguage) {
      next = { ...next, secondaryLanguage: next.primaryLanguage === "en" ? "zh" : "en" };
    }
    setPreferencesState(next);
    updateDocumentLanguage(next.primaryLanguage);
    if (remember) {
      window.localStorage.setItem(LANGUAGE_PREFERENCES_STORAGE_KEY, JSON.stringify(next));
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next.primaryLanguage);
      setHasChosenLanguage(true);
      setPickerOpen(false);
    }
  }, []);

  const setPrimaryLanguage = useCallback((next: Language, remember = true) => {
    const secondaryLanguage = next === preferences.secondaryLanguage ? (next === "en" ? "zh" : "en") : preferences.secondaryLanguage;
    setLanguagePreferences({ primaryLanguage: next, secondaryLanguage }, remember);
  }, [preferences.secondaryLanguage, setLanguagePreferences]);

  const setSecondaryLanguage = useCallback((next: Language, remember = true) => {
    if (next === preferences.primaryLanguage) return;
    setLanguagePreferences({ ...preferences, secondaryLanguage: next }, remember);
  }, [preferences, setLanguagePreferences]);

  const setLanguage = useCallback((next: Language, remember = true) => setPrimaryLanguage(next, remember), [setPrimaryLanguage]);

  const resetToDefault = useCallback(() => {
    setLanguagePreferences(defaultLanguagePreferences(window.navigator.language), true);
  }, [setLanguagePreferences]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      ...preferences,
      language: preferences.primaryLanguage,
      hasChosenLanguage,
      setLanguage,
      setPrimaryLanguage,
      setSecondaryLanguage,
      setLanguagePreferences,
      swapLanguages: () => setLanguagePreferences({ primaryLanguage: preferences.secondaryLanguage, secondaryLanguage: preferences.primaryLanguage }, true),
      resetToDefault,
      openLanguagePicker: () => setPickerOpen(true),
    }),
    [preferences, hasChosenLanguage, resetToDefault, setLanguage, setPrimaryLanguage, setSecondaryLanguage, setLanguagePreferences],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {pickerOpen && <LanguageWelcome onClose={() => setPickerOpen(false)} />}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
