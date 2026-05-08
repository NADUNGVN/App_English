// @ts-nocheck
"use client";

import { LocalePicker } from "../common/LocalePicker";

export function TopbarLocalePicker({ locale, onChange }) {
  return <LocalePicker dense locale={locale} onChange={onChange} />;
}
