// @ts-nocheck
"use client";

import { LocalePicker } from "../common/LocalePicker";

export function TopbarLocalePicker({ locale, onChange }) {
  return <LocalePicker locale={locale} onChange={onChange} />;
}
