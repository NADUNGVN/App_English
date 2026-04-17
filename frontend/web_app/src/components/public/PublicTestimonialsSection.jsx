import { ArrowLeft, ArrowRight, Star } from "@phosphor-icons/react";

function PlaceholderCard() {
  return (
    <article className="surface-panel flex h-full flex-col p-7">
      <div className="flex items-center gap-1 text-brand-500">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={18} weight="fill" />
        ))}
      </div>

      <div className="mt-7 space-y-3">
        <div className="h-4 rounded-full bg-slate-100" />
        <div className="h-4 w-[92%] rounded-full bg-slate-100" />
        <div className="h-4 w-[84%] rounded-full bg-slate-100" />
        <div className="h-4 w-[88%] rounded-full bg-slate-100" />
        <div className="h-4 w-[64%] rounded-full bg-slate-100" />
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[rgb(var(--surface-public-dark))]" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded-full bg-slate-200" />
            <div className="h-3 w-20 rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="h-9 w-32 rounded-full bg-brand-50" />
      </div>
    </article>
  );
}

export function PublicTestimonialsSection({ title, description }) {
  return (
    <section className="page-shell py-20 lg:py-24">
      <div className="space-y-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="section-title">{title}</h2>
          {description ? <p className="section-copy mx-auto">{description}</p> : null}
        </div>

        <div className="relative">
          <button
            aria-hidden="true"
            className="absolute left-0 top-1/2 hidden h-14 w-14 -translate-x-6 -translate-y-1/2 items-center justify-center rounded-full border border-[rgb(226,214,197)] bg-white text-slate-500 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.3)] lg:inline-flex"
            disabled
            type="button"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>

          <button
            aria-hidden="true"
            className="absolute right-0 top-1/2 hidden h-14 w-14 translate-x-6 -translate-y-1/2 items-center justify-center rounded-full border border-[rgb(226,214,197)] bg-white text-slate-500 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.3)] lg:inline-flex"
            disabled
            type="button"
          >
            <ArrowRight size={20} weight="bold" />
          </button>

          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <PlaceholderCard key={index} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${index === 2 ? "bg-brand-500" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
