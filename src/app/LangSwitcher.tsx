"use client";

import { type LandingLang } from "./landing-i18n";

const FLAGS: Record<LandingLang, string> = {
  en: "\uD83C\uDDFA\uD83C\uDDF8",
  pt: "\uD83C\uDDE7\uD83C\uDDF7",
  es: "\uD83C\uDDF2\uD83C\uDDFD",
};

export default function LangSwitcher({
  lang,
  onChange,
}: {
  lang: LandingLang;
  onChange: (l: LandingLang) => void;
}) {
  return (
    <div className="r-lang-switcher">
      {(["en", "pt", "es"] as LandingLang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`r-lang-btn ${lang === l ? "active" : ""}`}
          title={l === "en" ? "English" : l === "pt" ? "Portugu\u00eas" : "Espa\u00f1ol"}
        >
          {FLAGS[l]}
        </button>
      ))}
    </div>
  );
}
