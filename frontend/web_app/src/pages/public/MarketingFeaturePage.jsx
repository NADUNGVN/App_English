import {
  ArrowRight,
  BookOpenText,
  Headphones,
  NotePencil,
  SpeakerSimpleHigh,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { PublicTestimonialsSection } from "../../components/public/PublicTestimonialsSection.jsx";
import {
  marketingFeaturePages,
  marketingTestimonialsByPage,
} from "../../data/marketingContent.js";
import { useAppContext } from "../../hooks/useAppContext.js";

const pageIconMap = {
  listening: Headphones,
  reading: BookOpenText,
  speaking: SpeakerSimpleHigh,
  writing: NotePencil,
};

export function MarketingFeaturePage({ pageKey }) {
  const { locale } = useAppContext();
  const page = marketingFeaturePages[pageKey];
  const pageTestimonials = marketingTestimonialsByPage[pageKey];
  const HeroIcon = pageIconMap[page.icon];
  const featureTitleClass =
    locale === "vi"
      ? "type-display-public-feature-vi mx-auto max-w-[13.2ch]"
      : "type-display-public-feature-en mx-auto max-w-[12.2ch]";

  return (
    <div>
      <section className="public-hero-surface">
        <div className="page-shell flex min-h-[68dvh] flex-col items-center justify-center py-20 text-center lg:py-24">
          <div className="max-w-5xl space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[rgb(var(--ink-on-dark))] backdrop-blur-sm">
              <HeroIcon size={18} weight="duotone" />
              {page.eyebrow[locale]}
            </span>

            <div className="space-y-5">
              <h1 className={featureTitleClass}>{page.title[locale]}</h1>
              <p className="mx-auto max-w-[48rem] text-[1.08rem] leading-[1.72] text-[rgb(var(--ink-on-dark-muted))]">
                {page.description[locale]}
              </p>
            </div>

            {page.signals[locale]?.length ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {page.signals[locale].map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-white/10 bg-[rgba(33,28,24,0.8)] px-4 py-2 text-sm font-medium text-[rgb(var(--ink-on-dark-muted))]"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="pt-2">
              <Link
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3 text-[1rem] font-semibold tracking-[-0.02em] text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-brand-600 active:translate-y-[1px] active:scale-[0.98]"
                to="/register"
              >
                {page.ctaLabel[locale]}
                <ArrowRight size={18} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicTestimonialsSection
        description={pageTestimonials?.description?.[locale]}
        title={pageTestimonials?.title?.[locale]}
      />
    </div>
  );
}
