import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import cn from "../locales/cn.json";
import fil from "../locales/fil.json";
import id from "../locales/id.json";
import th from "../locales/th.json";
import vi from "../locales/vi.json";
import ms from "../locales/ms.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cn: { translation: cn },
    fil: { translation: fil },
    id: { translation: id },
    th: { translation: th },
    vi: { translation: vi },
    ms: { translation: ms },
  },
  lng: "en", // default language
  fallbackLng: "en", // fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
