import {
  ArrowRight,
  BookOpenText,
  Certificate,
  Headphones,
  Lightning,
  NotePencil,
  SpeakerSimpleHigh,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { AuthEntryLink } from "../../components/common/AuthEntryLink.jsx";
import { PublicTestimonialsSection } from "../../components/public/PublicTestimonialsSection.jsx";
import {
  homePageContent,
  marketingTestimonialsByPage,
} from "../../data/marketingContent.js";
import { useAppContext } from "../../hooks/useAppContext.js";

const skillIconMap = {
  listening: Headphones,
  practice: Lightning,
  reading: BookOpenText,
  speaking: SpeakerSimpleHigh,
  test: Certificate,
  writing: NotePencil,
};

const skillToneMap = {
  listening: {
    bg: "bg-[rgba(255,247,237,0.98)]",
    text: "text-brand-600",
  },
  practice: {
    bg: "bg-sand-50",
    text: "text-ink-950",
  },
  reading: {
    bg: "bg-[rgba(255,247,237,0.98)]",
    text: "text-brand-600",
  },
  speaking: {
    bg: "bg-[rgba(255,247,237,0.98)]",
    text: "text-brand-600",
  },
  test: {
    bg: "bg-[rgba(255,247,237,0.92)]",
    text: "text-brand-700",
  },
  writing: {
    bg: "bg-[rgba(255,247,237,0.98)]",
    text: "text-brand-600",
  },
};

function SkillIcon({ iconKey, size = 26 }) {
  const Icon = skillIconMap[iconKey];
  const tone = skillToneMap[iconKey];

  return (
    <span
      className={`inline-flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-[rgba(217,119,6,0.24)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] ${tone.bg} ${tone.text}`}
    >
      <Icon size={size} weight="duotone" />
    </span>
  );
}

function HeroSkillCard({ card, locale }) {
  const cardBody = (
    <>
      <div className="flex justify-center">
        <SkillIcon iconKey={card.icon} size={26} />
      </div>
      <div className="mt-6 space-y-2 text-center">
        <h3 className="text-[1.22rem] font-semibold leading-[1.16] tracking-[-0.028em] text-ink-950">
          {card.title}
        </h3>
        {card.description[locale] ? (
          <p className="text-[0.84375rem] leading-[1.62] text-slate-500">{card.description[locale]}</p>
        ) : null}
      </div>
    </>
  );

  if (!card.to) {
    return (
      <article className="rounded-[1.65rem] border border-[rgba(217,119,6,0.14)] bg-white px-6 py-7 text-center shadow-[0_28px_54px_-36px_rgba(15,23,42,0.32)]">
        {cardBody}
      </article>
    );
  }

  return (
    <Link
      className="block rounded-[1.65rem] border border-[rgba(217,119,6,0.16)] bg-white px-6 py-7 shadow-[0_28px_54px_-36px_rgba(15,23,42,0.32)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:border-brand-300 hover:shadow-[0_28px_54px_-32px_rgba(120,53,15,0.28)] active:translate-y-[1px] active:scale-[0.985]"
      to={card.to}
    >
      {cardBody}
    </Link>
  );
}

function SkillPathCard({ card, comingSoonLabel, locale }) {
  const cardBody = (
    <>
      <div className="flex items-start justify-between gap-3">
        <SkillIcon iconKey={card.icon} size={24} />
        {!card.to ? (
          <span className="rounded-full bg-sand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {comingSoonLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="type-title-card">{card.title}</h3>
        <p className="type-body-sm">{card.description[locale]}</p>
      </div>
    </>
  );

  if (!card.to) {
    return (
      <article className="rounded-[1.55rem] border border-[rgb(231,220,204)] bg-white/82 p-5 opacity-95">
        {cardBody}
      </article>
    );
  }

  return (
    <Link
      className="rounded-[1.55rem] border border-[rgb(231,220,204)] bg-white/88 p-5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:border-brand-200 hover:shadow-[0_22px_44px_-34px_rgba(120,53,15,0.28)]"
      to={card.to}
    >
      {cardBody}
    </Link>
  );
}

export function LandingPage() {
  const { locale } = useAppContext();
  const { hero, skillShowcase } = homePageContent;
  const heroTitleClass =
    locale === "vi"
      ? "type-display-public-vi max-w-[11.5ch]"
      : "type-display-public-en max-w-[10.5ch]";
  const proofTitleClass = locale === "vi" ? "type-public-proof-vi" : "type-public-proof-en";

  return (
    <div>
      <section className="public-hero-surface">
        <div className="page-shell grid gap-12 py-16 lg:min-h-[calc(100dvh-84px)] lg:grid-cols-[minmax(0,1.02fr),minmax(440px,0.98fr)] lg:items-center lg:gap-14 lg:py-20">
          <div className="space-y-8 lg:pr-6">
            <div className="space-y-4">
              <h1 className={heroTitleClass}>
                {hero.title[locale]}
              </h1>
              <p className="max-w-[34rem] text-[1.05rem] leading-[1.72] text-[rgb(var(--ink-on-dark-muted))]">
                {hero.description[locale]}
              </p>
            </div>

            <div>
              <AuthEntryLink
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-brand-500 px-7 py-3 text-[1rem] font-semibold tracking-[-0.02em] text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-brand-600 active:translate-y-[1px] active:scale-[0.98]"
              >
                {hero.ctaLabel[locale]}
              </AuthEntryLink>
            </div>

            <div className="max-w-[31rem] rounded-[1.85rem] border border-white/10 bg-[rgba(33,28,24,0.88)] p-6 shadow-[0_30px_60px_-42px_rgba(8,15,35,0.52)] backdrop-blur-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {hero.proofBadges[locale].map((badge) => (
                  <div
                    key={badge}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--ink-on-dark-muted))]"
                  >
                    <span className="h-3 w-3 rounded-full bg-brand-300" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <h2 className={proofTitleClass}>
                  {hero.proofTitle[locale]}
                </h2>
                <p className="text-base leading-[1.72] text-[rgb(var(--ink-on-dark-muted))]">
                  {hero.proofCopy[locale]}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:pl-2">
            {hero.skills.map((card) => (
              <HeroSkillCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-20 lg:py-24">
        <div className="rounded-[2rem] border border-[rgb(226,214,197)] bg-[linear-gradient(145deg,rgba(255,252,247,0.98),rgba(248,242,232,0.9))] p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.28)] lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.84fr,1.16fr] lg:items-start">
            <div className="space-y-5 lg:pr-8">
              <p className="type-eyebrow-label">{skillShowcase.eyebrow[locale]}</p>
              <h2 className="section-title">{skillShowcase.title[locale]}</h2>
              <p className="section-copy">{skillShowcase.description[locale]}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {skillShowcase.cards.map((card) => (
                <SkillPathCard
                  key={card.id}
                  card={card}
                  comingSoonLabel={skillShowcase.comingSoonLabel[locale]}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicTestimonialsSection locale={locale} section={marketingTestimonialsByPage.home} />
    </div>
  );
}
