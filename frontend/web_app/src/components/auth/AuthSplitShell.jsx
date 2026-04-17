import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { BrandMark } from "../common/BrandMark.jsx";
import { LanguageToggle } from "../common/LanguageToggle.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";

export function AuthSplitShell({
  children,
  formDescription,
  formEyebrow,
  formTitle,
  showcase,
}) {
  const { locale, setLocale } = useAppContext();

  const backLabel = locale === "vi" ? "Về trang giới thiệu" : "Back to site";

  return (
    <section className="page-shell py-4 lg:py-6">
      <div className="grid min-h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] border border-[rgb(226,214,197)] bg-[rgba(255,252,247,0.76)] shadow-[0_28px_80px_-44px_rgba(120,53,15,0.26)] lg:grid-cols-[minmax(430px,0.94fr),minmax(0,1.06fr)] lg:rounded-[2.25rem]">
        <aside className="relative hidden overflow-hidden border-r border-white/70 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,118,110,0.14),transparent_30%),linear-gradient(145deg,rgba(255,247,237,0.98),rgba(255,252,247,0.96)_48%,rgba(243,247,244,0.98))]" />
          <div className="absolute -right-8 top-14 h-48 w-48 rounded-full bg-brand-100/55 blur-3xl" />
          <div className="absolute left-8 top-32 h-20 w-20 rounded-full border border-white/70 bg-white/40" />

          <div className="relative flex h-full flex-col justify-between p-8 xl:p-10">
            <BrandMark compact />

            <div className="max-w-[29rem] space-y-5">
              <p className="type-eyebrow-label">{showcase.eyebrow}</p>
              <h2 className="font-semibold leading-[0.98] tracking-[-0.065em] text-ink-950 text-[clamp(3.15rem,5vw,4.85rem)]">
                {showcase.title}
              </h2>
              <p className="max-w-[26rem] text-[1rem] leading-[1.72] text-slate-600">
                {showcase.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.7rem] border border-white/70 bg-white/72 p-6 shadow-[0_28px_48px_-34px_rgba(120,53,15,0.24)]">
                <div className="flex items-end gap-4">
                  <div className="min-w-0">
                    <p className="text-[3.15rem] font-semibold leading-none tracking-[-0.08em] text-ink-950">
                      {showcase.metricPrimary}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {showcase.metricPrimaryLabel}
                    </p>
                  </div>

                  <ArrowRight
                    className="mb-3 shrink-0 text-brand-500"
                    size={22}
                    weight="bold"
                  />

                  <div className="min-w-0">
                    <p className="text-[2.35rem] font-semibold leading-none tracking-[-0.055em] text-ink-950">
                      {showcase.metricSecondary}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {showcase.metricSecondaryLabel}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-slate-600">
                  {showcase.metricCaption}
                </p>
              </div>

              <div className="grid gap-3 xl:grid-cols-3">
                {showcase.facts.map((fact) => (
                  <div
                    key={fact}
                    className="rounded-[1.35rem] border border-white/70 bg-white/58 px-4 py-4 text-sm font-medium leading-relaxed text-slate-600 shadow-[0_18px_38px_-32px_rgba(120,53,15,0.24)]"
                  >
                    {fact}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-[calc(100dvh-2rem)] flex-col bg-[rgba(255,252,247,0.9)] lg:min-h-full">
          <div className="flex items-center justify-between gap-3 border-b border-white/70 px-5 py-4 lg:px-8">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-ink-950"
              to="/"
            >
              <ArrowLeft size={16} weight="bold" />
              {backLabel}
            </Link>

            <LanguageToggle locale={locale} onChange={setLocale} quiet />
          </div>

          <div className="flex flex-1 items-center px-5 py-8 lg:px-10 lg:py-12 xl:px-14">
            <div className="mx-auto w-full max-w-[30rem] space-y-6">
              <div className="space-y-3">
                <p className="type-eyebrow-label">{formEyebrow}</p>
                <h1 className="type-display-auth max-w-[11ch]">{formTitle}</h1>
                <p className="type-body-md max-w-[34rem]">{formDescription}</p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
