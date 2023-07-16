import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import languages from "../languages.json";

import commonEn from "./locales/en.json";

const resources = {
  en: commonEn,
  // es: { common: commonEs },
  // fr: { common: commonFr },
};

const options = {
  order: ["querystring", "navigator"],
  lookupQuerystring: "lng",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: 'en' // <--- turn off for detection to work
    detection: options,
    resources,
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: [
      ...languages,
      {
        locale_code: "en-US",
      },
    ].map((language) => language.locale_code),
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

console.log(i18n.t("meta.title"), i18n.language);

export default i18n;
