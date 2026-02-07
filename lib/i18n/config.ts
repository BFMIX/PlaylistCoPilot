export const locales = ["en", "fr", "es", "zh"] as const
export const defaultLocale = "en"

export type Locale = typeof locales[number]

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  zh: "中文",
}

export const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  zh: () => import("./dictionaries/zh.json").then((module) => module.default),
}
