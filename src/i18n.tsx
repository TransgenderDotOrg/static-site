import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import XHR from "i18next-http-backend" // <---- add this

import commonDe from './locales/de/common.json'
import commonEn from './locales/en/common.json'
import commonEs from './locales/es/common.json'
import commonFr from './locales/fr/common.json'

const resources = {
  de: { common: commonDe },
  en: { common: commonEn },
  es: { common: commonEs },
  fr: { common: commonFr }
}

const options = {
  order: ['querystring', 'navigator'],
  lookupQuerystring: 'lng'
}

i18n
  .use(XHR) // <---- add this
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: 'en' // <--- turn off for detection to work
    detection: options,
    resources,
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['af', 'ar', 'be', 'bn', 'bho', 'bg', 'yue', 'ca', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'de', 'el', 'gu', 'he', 'hi', 'hmn', 'ha', 'hu', 'is', 'id', 'it', 'ja', 'jv', 'kn', 'ko', 'lv', 'ar-LB', 'lt', 'zh-CN', 'zh-TW', 'mr', 'nb', 'nn', 'fa', 'pt', 'pa', 'ro', 'ru', 'sr', 'wuu', 'sk', 'sl', 'es', 'sw', 'sv', 'tl', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi'],
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  })

export default i18n