export function LanguageToggle({ locale, onChange, quiet = false }) {
  return (
    <div
      className={`inline-flex rounded-full border p-1 ${
        quiet ? "border-white/80 bg-white/80" : "border-sand-200 bg-white/70"
      }`}
      role="tablist"
      aria-label="Language toggle"
    >
      {[
        { label: "VI", value: "vi" },
        { label: "EN", value: "en" },
      ].map((item) => {
        const active = item.value === locale;
        return (
          <button
            key={item.value}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              active ? "bg-brand-500 text-white" : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
