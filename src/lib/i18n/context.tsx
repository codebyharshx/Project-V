'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language, TranslationKeys } from './translations'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de') // Default to German

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('velorious-language') as Language | null
    if (saved && (saved === 'en' || saved === 'de')) {
      setLanguageState(saved)
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('de')) {
        setLanguageState('de')
      } else {
        setLanguageState('en')
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('velorious-language', lang)
  }

  const t = translations[language]

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation() {
  const { t } = useI18n()
  return t
}
