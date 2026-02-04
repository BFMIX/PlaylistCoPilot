export const locales = ['en', 'fr'] as const
export const defaultLocale = 'en'

export type Locale = typeof locales[number]

export const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
}
