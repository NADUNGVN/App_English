import { ArrowLeft, ArrowRight, Star } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

const HOME_AUTOPLAY_MS = 4500;
const CAROUSEL_GAP = 24;
const CAROUSEL_PEEK = 72;
const CLONE_COUNT = 2;

function normalizeIndex(index, total) {
  if (!total) {
    return 0;
  }

  return ((index % total) + total) % total;
}

function TestimonialCard({ item, locale }) {
  return (
    <article className="surface-panel flex h-full flex-col p-7">
      <div className="flex items-center gap-1 text-brand-500">
        {Array.from({ length: item.rating ?? 5 }).map((_, index) => (
          <Star key={index} size={18} weight="fill" />
        ))}
      </div>

      <p className="mt-7 text-[1.01rem] leading-[1.72] tracking-[-0.01em] text-slate-700">
        {item.quote[locale]}
      </p>

      <div className="mt-auto flex items-center justify-between gap-4 pt-10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(var(--surface-public-dark))] text-base font-semibold tracking-[-0.03em] text-white">
            {item.initials}
          </div>

          <div className="space-y-1">
            <p className="text-[1rem] font-semibold tracking-[-0.02em] text-ink-950">{item.name}</p>
            <p className="text-sm text-slate-500">{item.meta[locale]}</p>
          </div>
        </div>

        <div className="rounded-full bg-brand-50 px-4 py-2 text-[0.8125rem] font-semibold tracking-[-0.01em] text-brand-700">
          {item.badge[locale]}
        </div>
      </div>
    </article>
  );
}

function TestimonialDots({ activeIndex, items, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {items.map((item, index) => (
        <button
          key={item.id}
          aria-label={`Go to testimonial ${index + 1}`}
          className={`h-3 w-3 rounded-full transition duration-300 ${
            index === activeIndex ? "bg-brand-500" : "bg-slate-200 hover:bg-brand-200"
          }`}
          onClick={() => onSelect(index)}
          type="button"
        />
      ))}
    </div>
  );
}

function CarouselArrow({ direction, onClick }) {
  const isLeft = direction === "left";

  return (
    <button
      aria-label={isLeft ? "Previous testimonials" : "Next testimonials"}
      className={`absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[rgb(226,214,197)] bg-white text-slate-500 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.3)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1/2 hover:border-brand-200 hover:text-ink-950 lg:inline-flex ${
        isLeft ? "-left-6" : "-right-6"
      }`}
      onClick={onClick}
      type="button"
    >
      {isLeft ? <ArrowLeft size={20} weight="bold" /> : <ArrowRight size={20} weight="bold" />}
    </button>
  );
}

function TestimonialGrid({ items, locale }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <TestimonialCard key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

function HomeTestimonialsCarousel({ items, locale }) {
  const viewportRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(CLONE_COUNT);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInstant, setIsInstant] = useState(false);

  const extendedItems = useMemo(
    () => [
      ...items.slice(-CLONE_COUNT),
      ...items,
      ...items.slice(0, CLONE_COUNT),
    ],
    [items],
  );

  const activeIndex = normalizeIndex(currentIndex - CLONE_COUNT, items.length);
  const isDesktopReady = viewportWidth > 0;

  useEffect(() => {
    if (!viewportRef.current) {
      return undefined;
    }

    const viewport = viewportRef.current;
    const updateWidth = () => {
      setViewportWidth(viewport.clientWidth);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);

      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (viewportWidth <= 0 || isHovering || isAnimating) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIsInstant(false);
      setIsAnimating(true);
      setCurrentIndex((index) => index + 1);
    }, HOME_AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [viewportWidth, isHovering, isAnimating]);

  useEffect(() => {
    if (!isInstant) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsInstant(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isInstant]);

  const handleNext = () => {
    if (isAnimating) {
      return;
    }

    setIsInstant(false);
    setIsAnimating(true);
    setCurrentIndex((index) => index + 1);
  };

  const handlePrev = () => {
    if (isAnimating) {
      return;
    }

    setIsInstant(false);
    setIsAnimating(true);
    setCurrentIndex((index) => index - 1);
  };

  const handleSelect = (targetIndex) => {
    if (targetIndex === activeIndex) {
      return;
    }

    if (!isDesktopReady) {
      setIsInstant(false);
      setCurrentIndex(normalizeIndex(targetIndex, items.length) + CLONE_COUNT);
      return;
    }

    if (isAnimating) {
      return;
    }

    setIsInstant(false);
    setIsAnimating(true);
    setCurrentIndex(targetIndex + CLONE_COUNT);
  };

  const handleMobileSelect = (offset) => {
    setIsInstant(false);
    setCurrentIndex(normalizeIndex(activeIndex + offset, items.length) + CLONE_COUNT);
  };

  const handleTransitionEnd = () => {
    if (!isAnimating) {
      return;
    }

    if (currentIndex === items.length + CLONE_COUNT) {
      setIsAnimating(false);
      setIsInstant(true);
      setCurrentIndex(CLONE_COUNT);
      return;
    }

    if (currentIndex === CLONE_COUNT - 1) {
      setIsAnimating(false);
      setIsInstant(true);
      setCurrentIndex(items.length + CLONE_COUNT - 1);
      return;
    }

    setIsAnimating(false);
  };

  const desktopCardWidth =
    viewportWidth > 0 ? Math.max((viewportWidth - 2 * CAROUSEL_PEEK - 4 * CAROUSEL_GAP) / 3, 240) : 320;
  const desktopTranslateX =
    CAROUSEL_PEEK + CAROUSEL_GAP - currentIndex * (desktopCardWidth + CAROUSEL_GAP);

  return (
    <>
      <div className="relative hidden lg:block">
        <CarouselArrow direction="left" onClick={handlePrev} />
        <CarouselArrow direction="right" onClick={handleNext} />

        <div
          ref={viewportRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className={`flex ${isInstant ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"}`}
            onTransitionEnd={handleTransitionEnd}
            style={{
              gap: `${CAROUSEL_GAP}px`,
              transform: `translate3d(${desktopTranslateX}px, 0, 0)`,
            }}
          >
            {extendedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="shrink-0"
                style={{ width: `${desktopCardWidth}px` }}
              >
                <TestimonialCard item={item} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:hidden">
        <TestimonialCard item={items[activeIndex]} locale={locale} />

        <div className="flex items-center justify-center gap-4">
          <button
            aria-label="Previous testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(226,214,197)] bg-white text-slate-500 transition duration-300 hover:border-brand-200 hover:text-ink-950"
            onClick={() => handleMobileSelect(-1)}
            type="button"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>

          <button
            aria-label="Next testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(226,214,197)] bg-white text-slate-500 transition duration-300 hover:border-brand-200 hover:text-ink-950"
            onClick={() => handleMobileSelect(1)}
            type="button"
          >
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      <TestimonialDots activeIndex={activeIndex} items={items} onSelect={handleSelect} />
    </>
  );
}

export function PublicTestimonialsSection({ section, locale }) {
  if (!section || section.variant === "hidden") {
    return null;
  }

  return (
    <section className="page-shell py-20 lg:py-24">
      <div className="space-y-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="section-title">{section.title[locale]}</h2>
          {section.description?.[locale] ? (
            <p className="section-copy mx-auto">{section.description[locale]}</p>
          ) : null}
        </div>

        {section.variant === "carousel" ? (
          <HomeTestimonialsCarousel items={section.items} locale={locale} />
        ) : null}

        {section.variant === "grid" ? (
          <TestimonialGrid items={section.items} locale={locale} />
        ) : null}
      </div>
    </section>
  );
}
