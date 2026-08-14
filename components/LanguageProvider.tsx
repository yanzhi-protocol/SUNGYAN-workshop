"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Language } from "@/lib/i18n";
import { detectBrowserLanguage, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import LanguageWelcome from "./LanguageWelcome";

type LanguageContextValue = {
  language: Language;
  hasChosenLanguage: boolean;
  setLanguage: (language: Language, remember?: boolean) => void;
  openLanguagePicker: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  const [ready, setReady] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    const supported = LANGUAGE_OPTIONS.some((option) => option.code === stored);
    if (supported && stored) {
      setLanguageState(stored);
      document.documentElement.lang = LANGUAGE_OPTIONS.find((option) => option.code === stored)?.locale ?? stored;
      document.documentElement.dir = stored === "ar" ? "rtl" : "ltr";
      setHasChosenLanguage(true);
    } else {
      setLanguageState(detectBrowserLanguage(window.navigator.language));
    }
    setReady(true);
  }, []);

  const setLanguage = (next: Language, remember = true) => {
    setLanguageState(next);
    document.documentElement.lang = LANGUAGE_OPTIONS.find((option) => option.code === next)?.locale ?? next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    if (remember) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      setHasChosenLanguage(true);
      setPickerOpen(false);
    }
  };

  const value = useMemo(
    () => ({
      language,
      hasChosenLanguage,
      setLanguage,
      openLanguagePicker: () => setPickerOpen(true),
    }),
    [language, hasChosenLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {ready && (!hasChosenLanguage || pickerOpen) && <LanguageWelcome onClose={() => setPickerOpen(false)} />}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
