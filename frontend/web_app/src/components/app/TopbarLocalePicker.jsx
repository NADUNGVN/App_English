import { LocalePicker } from "../common/LocalePicker.jsx";

export function TopbarLocalePicker({ locale, onChange }) {
  return <LocalePicker locale={locale} onChange={onChange} />;
}
