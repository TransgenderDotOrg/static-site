import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import languages from "../languages.json";

import enUS from "./locales/en-US.json";
import deDE from "./locales/de-DE.json";
import esES from "./locales/es-ES.json";
import frFR from "./locales/fr-FR.json";
import ukUA from "./locales/uk-UA.json";
import zhCN from "./locales/zh-CN.json";
import koKR from "./locales/ko-KR.json";
import viVN from "./locales/vi-VN.json";
import taIN from "./locales/ta-IN.json";
import hiIN from "./locales/hi-IN.json";
import trTR from "./locales/tr-TR.json";
import arSA from "./locales/ar-SA.json";
import teIN from "./locales/te-IN.json";
import bnBD from "./locales/bn-BD.json";
import ruRU from "./locales/ru-RU.json";
import mrIN from "./locales/mr-IN.json";
import ptPT from "./locales/pt-PT.json";
import swKE from "./locales/sw-KE.json";
import jaJP from "./locales/ja-JP.json";
import idID from "./locales/id-ID.json";
import urPK from "./locales/ur-PK.json";

const resources = {
  "en-US": {
    common: enUS,
  },
  "de-DE": {
    common: deDE,
  },
  "es-ES": {
    common: esES,
  },
  "fr-FR": {
    common: frFR,
  },
  "uk-UA": {
    common: ukUA,
  },
  "zh-CN": {
    common: zhCN,
  },
  "ko-KR": {
    common: koKR,
  },
  "vi-VN": {
    common: viVN,
  },
  "ta-IN": {
    common: taIN,
  },
  "hi-IN": {
    common: hiIN,
  },
  "tr-TR": {
    common: trTR,
  },
  "ar-SA": {
    common: arSA,
  },
  "te-IN": {
    common: teIN,
  },
  "bn-BD": {
    common: bnBD,
  },
  "ru-RU": {
    common: ruRU,
  },
  "mr-IN": {
    common: mrIN,
  },
  "pt-PT": {
    common: ptPT,
  },
  "sw-KE": {
    common: swKE,
  },
  "ja-JP": {
    common: jaJP,
  },
  "id-ID": {
    common: idID,
  },
  "ur-PK": {
    common: urPK,
  },
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
    fallbackLng: "en-US",
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

export default i18n;
