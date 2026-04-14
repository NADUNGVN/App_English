import { LocalePicker } from "./LocalePicker.jsx";

export function LanguageToggle({ locale, onChange, quiet = false }) {
  return <LocalePicker locale={locale} onChange={onChange} quiet={quiet} />;
}
