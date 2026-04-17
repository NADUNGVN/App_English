import { ArrowRight, CheckCircle, Coins, Sparkle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { pricingContent } from "../../data/marketingContent.js";
import { useAppContext } from "../../hooks/useAppContext.js";

export function PricingPage() {
  const { isAuthenticated, locale } = useAppContext();
  const ctaTarget = isAuthenticated ? "/dashboard" : "/register";
  const primaryLabel = locale === "vi" ? "Bắt đầu với QuackUp" : "Start with QuackUp";

  const [starterPlan, practicePlan, intensivePlan] = pricingContent.plans;

  return (
    <div>
      <section className="bg-hero-wash">
        <div className="page-shell grid gap-10 pb-16 pt-10 lg:min-h-[calc(100dvh-84px)] lg:grid-cols-[minmax(0,0.92fr),minmax(520px,1.08fr)] lg:items-start lg:gap-12 lg:pb-20 lg:pt-14">
          <div className="max-w-[41rem] space-y-7 lg:pt-8">
            <span className="eyebrow">
              <Coins size={16} weight="duotone" />
              {pricingContent.eyebrow[locale]}
            </span>

            <div className="space-y-4">
              <h1 className="type-display-hero max-w-[11ch]">{pricingContent.title[locale]}</h1>
              <p className="type-body-lg max-w-[37rem]">{pricingContent.description[locale]}</p>
            </div>

            <p className="rounded-[1.4rem] border border-brand-100 bg-white/75 px-4 py-3 text-sm font-medium text-brand-700">
              {pricingContent.note[locale]}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link className="button-primary" to={ctaTarget}>
                {primaryLabel}
                <ArrowRight size={18} weight="bold" />
              </Link>
              {!isAuthenticated ? (
                <Link className="button-secondary" to="/login">
                  {locale === "vi" ? "Đăng nhập" : "Log in"}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="surface-panel relative overflow-hidden p-6">
              <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-brand-100/70 blur-3xl" />
              <div className="relative z-10">
                <span className="eyebrow">{practicePlan.name[locale]}</span>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="type-display-auth max-w-[8ch]">{practicePlan.price[locale]}</p>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {practicePlan.cadence[locale]}
                    </p>
                  </div>
                  <p className="type-body-sm max-w-md">{practicePlan.summary[locale]}</p>
                </div>

                <div className="mt-6 space-y-3">
                  {practicePlan.features[locale].map((feature) => (
                    <div key={feature} className="flex items-start gap-3 rounded-[1.25rem] bg-white/80 px-4 py-3">
                      <CheckCircle
                        className="mt-0.5 shrink-0 text-sage-700"
                        size={18}
                        weight="fill"
                      />
                      <p className="text-sm font-medium leading-relaxed text-slate-600">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[starterPlan, intensivePlan].map((plan) => (
                <div key={plan.id} className="surface-panel-soft p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="type-eyebrow-label">{plan.name[locale]}</p>
                      <p className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-ink-950">
                        {plan.price[locale]}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {plan.cadence[locale]}
                      </p>
                    </div>
                    {plan.highlight ? (
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
                        {locale === "vi" ? "Gợi ý" : "Suggested"}
                      </span>
                    ) : null}
                  </div>
                  <p className="type-body-sm mt-4">{plan.summary[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-10 lg:grid-cols-[0.92fr,1.08fr] lg:items-start">
          <div className="space-y-5">
            <span className="eyebrow">
              <Sparkle size={16} weight="duotone" />
              {pricingContent.eyebrow[locale]}
            </span>
            <h2 className="section-title max-w-xl">{pricingContent.comparisonTitle[locale]}</h2>
          </div>

          <div className="surface-panel overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1.6fr),repeat(3,minmax(0,1fr))] border-b border-sand-200 bg-white/80">
              <div className="px-5 py-4" />
              {pricingContent.plans.map((plan) => (
                <div key={plan.id} className="px-4 py-4 text-center">
                  <p className="text-sm font-semibold text-ink-950">{plan.name[locale]}</p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-sand-200">
              {pricingContent.comparisonRows.map((row) => (
                <div
                  key={row.label[locale]}
                  className="grid grid-cols-[minmax(0,1.6fr),repeat(3,minmax(0,1fr))] items-center"
                >
                  <div className="px-5 py-4 text-sm font-medium text-slate-600">
                    {row.label[locale]}
                  </div>
                  {row.values.map((value, index) => (
                    <div
                      key={`${row.label[locale]}-${value}-${index}`}
                      className="px-4 py-4 text-center text-sm font-semibold text-ink-950"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
