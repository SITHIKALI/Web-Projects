
// src/lib/i18n.ts
"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import ta from "@/locales/ta.json";
import ar from "@/locales/ar.json";
import ur from "@/locales/ur.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en,
      },
      hi: {
        translation: hi,
      },
      ta: {
        translation: ta,
      },
      ar: {
        translation: ar,
      },
      ur: {
        translation: ur,
      },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
