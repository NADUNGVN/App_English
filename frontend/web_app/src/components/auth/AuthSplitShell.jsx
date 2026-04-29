import { ArrowRight } from "@phosphor-icons/react";
import { BrandMark } from "../common/BrandMark.jsx";

function AuthHeader({ centered = false, formDescription, formEyebrow, formTitle }) {
  return (
    <div className={`space-y-3 ${centered ? "text-center" : ""}`}>
      {formEyebrow ? <p className="type-eyebrow-label">{formEyebrow}</p> : null}
      <h1 className={`type-display-auth max-w-[10ch] ${centered ? "mx-auto" : ""}`}>{formTitle}</h1>
      {formDescription ? (
        <p className={`type-body-md max-w-[30rem] ${centered ? "mx-auto" : ""}`}>{formDescription}</p>
      ) : null}
    </div>
  );
}

function AuthSidePanel({ sidePanel }) {
  return (
    <aside className="relative hidden overflow-hidden lg:flex">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,21,18,0.98)_0%,rgba(19,16,14,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.12),transparent_26%)]" />
      <div className="absolute -left-16 bottom-12 h-44 w-44 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative flex min-h-[100dvh] w-full flex-col justify-between p-10 xl:p-12">
        <BrandMark compact interactive={false} light />

        <div className="max-w-[31rem] space-y-5">
          {sidePanel.eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              {sidePanel.eyebrow}
            </p>
          ) : null}

          <h2 className="max-w-[8.8ch] text-[clamp(3rem,5vw,4.75rem)] font-semibold leading-[0.97] tracking-[-0.065em] text-white">
            {sidePanel.title}
          </h2>

          {sidePanel.description ? (
            <p className="max-w-[27rem] text-[1.02rem] leading-[1.72] text-[rgb(var(--ink-on-dark-muted))]">
              {sidePanel.description}
            </p>
          ) : null}
        </div>

        <div className="max-w-[30rem] space-y-5">
          <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_60px_-44px_rgba(0,0,0,0.55)] backdrop-blur-sm">
            <div className="flex items-end gap-4">
              <div className="min-w-0">
                <p className="text-[3.2rem] font-semibold leading-none tracking-[-0.08em] text-white">
                  {sidePanel.metricPrimary}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  {sidePanel.metricPrimaryLabel}
                </p>
              </div>

              <ArrowRight className="mb-3 shrink-0 text-brand-400" size={22} weight="bold" />

              <div className="min-w-0">
                <p className="text-[2.35rem] font-semibold leading-none tracking-[-0.06em] text-white">
                  {sidePanel.metricSecondary}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  {sidePanel.metricSecondaryLabel}
                </p>
              </div>
            </div>

            {sidePanel.metricCaption ? (
              <p className="mt-5 text-sm leading-relaxed text-[rgb(var(--ink-on-dark-muted))]">
                {sidePanel.metricCaption}
              </p>
            ) : null}
          </div>

          {sidePanel.footer ? (
            <p className="text-sm font-medium leading-relaxed text-white/52">{sidePanel.footer}</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export function AuthSplitShell({
  children,
  formDescription,
  formEyebrow,
  formTitle,
  sidePanel,
  variant = "plain",
}) {
  if (variant === "split" && sidePanel) {
    return (
      <section className="min-h-[100dvh] bg-white">
        <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(440px,0.92fr)_minmax(0,1.08fr)]">
          <AuthSidePanel sidePanel={sidePanel} />

          <div className="relative flex min-h-[100dvh] items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
            <div className="absolute left-6 top-6 lg:hidden">
              <BrandMark compact interactive={false} />
            </div>

            <div className="w-full max-w-[25.5rem] pt-16 text-center lg:pt-0">
              <AuthHeader
                centered
                formDescription={formDescription}
                formEyebrow={formEyebrow}
                formTitle={formTitle}
              />
              <div className="pt-8">{children}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[100dvh] bg-white">
      <div className="absolute left-6 top-6 sm:left-8 sm:top-7">
        <BrandMark compact interactive={false} />
      </div>

      <div className="flex min-h-[100dvh] items-center justify-center px-6 py-10 sm:px-8">
        <div className="w-full max-w-[24rem] pt-20 text-center lg:pt-0">
          <AuthHeader
            centered
            formDescription={formDescription}
            formEyebrow={formEyebrow}
            formTitle={formTitle}
          />
          <div className="pt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}
