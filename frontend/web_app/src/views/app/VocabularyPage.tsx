// @ts-nocheck
"use client";

import {
  ArrowLeft,
  BookOpenText,
  Brain,
  Cards,
  CheckCircle,
  ClockCounterClockwise,
  CrownSimple,
  GraduationCap,
  Headphones,
  Lightning,
  MagnifyingGlass,
  NotePencil,
  Play,
  ShareFat,
  Sparkle,
  Trophy,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyState, ErrorState, LoadingPanel } from "../../components/common/StatePanels";
import { useAppContext } from "../../hooks/useAppContext";
import { vocabularyRepository } from "../../repositories/vocabularyRepository";

const CATEGORY_FALLBACKS = {
  ACADEMIC: "Học thuật",
  ALL: "Tất cả",
  GENERAL: "Tổng quát",
  IELTS: "IELTS",
  OXFORD: "Oxford",
  TOEIC: "TOEIC",
};

const STATUS_LABELS = {
  LEARNING: "Đang học",
  MASTERED: "Đã thuộc",
  NEW: "Mới",
  REVIEW: "Cần ôn",
};

const QUALITY_COPY = {
  AGAIN: {
    label: "Quên",
    tone: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
  HARD: {
    label: "Khó",
    tone: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  GOOD: {
    label: "Ổn",
    tone: "border-sage-100 bg-sage-100 text-sage-700 hover:bg-sage-100/80",
  },
  EASY: {
    label: "Dễ",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
};

function getParam(value) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatCount(value, unit) {
  return `${value.toLocaleString("vi-VN")} ${unit}`;
}

function getPrimaryIpa(word) {
  return word.ipaUk || word.ipaUs || "";
}

function developmentToast() {
  window.alert("Tính năng này đang được phát triển.");
}

function ProgressBar({ percent }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-sand-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 via-amber-400 to-sage-600 transition-[width] duration-500"
        style={{ width: `${clampPercent(percent)}%` }}
      />
    </div>
  );
}

function SectionHeader({ action, eyebrow, title }) {
  return (
    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="type-eyebrow-label mb-1">{eyebrow}</p> : null}
        <h2 className="type-title-section">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-[1rem] border border-sand-200 bg-white/80 p-4">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[0.85rem] ${tone}`}>
          <Icon size={20} weight="duotone" />
        </span>
        <div>
          <p className="text-[1.45rem] font-semibold leading-none tracking-[-0.04em] text-ink-950">
            {value.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-[0.8rem] font-medium text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryTabs({ activeCategory, categories, onChange }) {
  return (
    <div className="scrollbar-hidden overflow-x-auto">
      <div className="inline-flex min-w-max rounded-[0.95rem] bg-slate-100 p-1">
        {categories.map((category) => {
          const active = activeCategory === category.id;
          return (
            <button
              className={`min-h-9 rounded-[0.72rem] px-3.5 text-[0.84rem] font-semibold transition ${
                active
                  ? "bg-white text-ink-950 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.45)]"
                  : "text-slate-500 hover:text-ink-950"
              }`}
              key={category.id}
              onClick={() => onChange(category.id)}
              type="button"
            >
              {category.label || CATEGORY_FALLBACKS[category.id] || category.id}
              <span className="ml-2 text-[0.75rem] text-slate-400">{category.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GeneratedCover({ collection, compact = false }) {
  return (
    <div className={`relative overflow-hidden bg-[#181512] ${compact ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_32%,rgba(255,237,213,0.92),transparent_0_19%,rgba(255,237,213,0.1)_20%,transparent_34%),linear-gradient(135deg,rgba(245,158,11,0.16),transparent_42%),linear-gradient(180deg,#1d1916,#0f1117)]" />
      <div className="absolute left-5 top-5 h-20 w-32 rotate-[-3deg] rounded-sm bg-[rgb(255,245,229)] shadow-[0_16px_30px_-20px_rgba(0,0,0,0.6)]" />
      <div className="absolute left-8 top-11 h-9 w-9 rounded-full border-2 border-slate-700" />
      <div className="absolute left-20 top-9 h-16 w-0.5 rotate-[38deg] bg-slate-700" />
      <div className="absolute right-5 top-5 rounded-sm bg-pink-500 px-2 py-1 text-[0.68rem] font-extrabold uppercase text-white">
        {collection.level ?? collection.category}
      </div>
      <div className="absolute inset-x-5 bottom-5">
        <p className="max-w-[14ch] text-[1.75rem] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-white">
          {collection.title}
        </p>
      </div>
      {collection.isPremium ? (
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full border border-brand-300 bg-brand-500/20 px-2.5 py-1 text-[0.72rem] font-bold text-brand-100">
          <CrownSimple size={14} weight="fill" />
          PRO
        </span>
      ) : null}
    </div>
  );
}

function CollectionCover({ collection, compact = false }) {
  if (collection.coverImageUrl) {
    return (
      <div className={`overflow-hidden bg-slate-100 ${compact ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
        <img
          alt={collection.title}
          className="h-full w-full object-cover"
          src={collection.coverImageUrl}
        />
      </div>
    );
  }

  return <GeneratedCover collection={collection} compact={compact} />;
}

function CollectionCard({ collection }) {
  return (
    <Link
      className="group block overflow-hidden rounded-[1rem] border border-sand-200 bg-white text-left shadow-[0_18px_42px_-34px_rgba(120,53,15,0.28)] transition duration-300 hover:-translate-y-[2px] hover:border-brand-200"
      href={`/vocabulary/${collection.slug}`}
    >
      <CollectionCover collection={collection} />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="type-title-card">{collection.title}</h3>
            <p className="mt-1 line-clamp-2 min-h-[2.7rem] text-[0.84rem] leading-relaxed text-slate-500">
              {collection.description}
            </p>
          </div>
          {collection.isPremium ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[0.7rem] font-bold text-brand-700">
              <CrownSimple size={13} weight="fill" />
              PRO
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[0.76rem] font-semibold text-slate-500">
          <span>{formatCount(collection.setCount, "bộ từ")}</span>
          <span>•</span>
          <span>{formatCount(collection.totalWordCount, "từ")}</span>
          {collection.level ? (
            <>
              <span>•</span>
              <span>{collection.level}</span>
            </>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[0.8rem]">
            <span className="text-slate-500">Đã thuộc</span>
            <span className="font-semibold text-ink-950">
              {collection.masteredCount}/{collection.totalWordCount}
            </span>
          </div>
          <ProgressBar percent={collection.progressPercent} />
        </div>
      </div>
    </Link>
  );
}

function SetCard({ collectionSlug, set }) {
  return (
    <Link
      className="group flex min-h-[10rem] flex-col justify-between rounded-[1rem] border border-sand-200 bg-white p-4 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200"
      href={`/vocabulary/${collectionSlug}/${set.slug}`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1rem] font-semibold leading-[1.25] tracking-[-0.025em] text-ink-950">
            {set.title}
          </h3>
          {set.dueToday ? (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.7rem] font-bold text-brand-700">
              {set.dueToday} cần ôn
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-[0.82rem] leading-relaxed text-slate-500">
          {set.description || "Bộ từ này đang sẵn sàng để luyện theo từng vòng ngắn."}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[0.8rem]">
          <span className="font-medium text-slate-500">{set.totalWordCount} từ</span>
          <span className="font-semibold text-ink-950">{set.progressPercent}%</span>
        </div>
        <ProgressBar percent={set.progressPercent} />
      </div>
    </Link>
  );
}

function WordRow({ word }) {
  const status = STATUS_LABELS[word.progress.status] ?? word.progress.status;

  return (
    <article className="rounded-[1rem] border border-sand-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-ink-950">
              {word.word}
            </h3>
            {word.partOfSpeech ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.68rem] font-bold uppercase text-slate-600">
                {word.partOfSpeech}
              </span>
            ) : null}
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.68rem] font-bold text-brand-700">
              {status}
            </span>
          </div>
          {getPrimaryIpa(word) ? (
            <p className="mt-1 font-mono text-[0.76rem] text-slate-400">{getPrimaryIpa(word)}</p>
          ) : null}
        </div>

        <button
          className="button-secondary min-h-9 rounded-[0.85rem] px-3"
          onClick={developmentToast}
          type="button"
        >
          <Headphones size={15} weight="duotone" />
          Nghe
        </button>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[0.85rem] bg-[rgb(255,248,240)] p-3">
          <p className="type-eyebrow-muted mb-1">Nghĩa</p>
          <p className="text-[0.88rem] font-semibold text-ink-950">{word.meaningVi}</p>
        </div>
        <div className="rounded-[0.85rem] bg-slate-50 p-3">
          <p className="type-eyebrow-muted mb-1">Định nghĩa</p>
          <p className="text-[0.88rem] text-slate-600">{word.definitionEn}</p>
        </div>
      </div>

      {word.exampleEn || word.exampleVi ? (
        <div className="mt-3 rounded-[0.85rem] border border-sand-200 bg-white p-3">
          <p className="type-eyebrow-muted mb-1">Ví dụ</p>
          {word.exampleEn ? <p className="text-[0.86rem] text-ink-950">{word.exampleEn}</p> : null}
          {word.exampleVi ? <p className="mt-1 text-[0.84rem] text-slate-500">{word.exampleVi}</p> : null}
        </div>
      ) : null}
    </article>
  );
}

function LibraryView({ catalog, category, onCategoryChange }) {
  const due = catalog.stats.dueToday;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[clamp(2rem,4vw,2.7rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-ink-950">
              Luyện từ vựng
            </h1>
            <span className="rounded-[0.65rem] bg-slate-800 px-2 py-1 text-[0.72rem] font-bold text-white">
              Beta
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-[1rem] leading-relaxed text-slate-500">
            Chinh phục từ vựng bằng thư viện theo mục tiêu và cơ chế lặp lại ngắt quãng.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="button-primary" onClick={developmentToast} type="button">
            <ShareFat size={17} weight="duotone" />
            Chia sẻ góp ý
          </button>
          <button className="button-secondary" onClick={developmentToast} type="button">
            <BookOpenText size={17} weight="duotone" />
            Hướng dẫn
          </button>
        </div>
      </section>

      <section className="rounded-[1rem] border border-sage-100 bg-sage-100/20 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-700">
            <ClockCounterClockwise size={20} weight="duotone" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[1rem] font-semibold text-ink-950">
              {due > 0 ? `Bạn có ${due} từ cần ôn hôm nay` : "Bạn đã ôn hết rồi!"}
            </h2>
            <p className="text-[0.85rem] text-slate-500">
              {due > 0
                ? "Vào phiên review để giữ nhịp học ngắn và đều."
                : "Không có từ nào cần ôn trong hôm nay."}
            </p>
          </div>
          <Link className="button-secondary ml-auto hidden sm:inline-flex" href="/vocabulary/review">
            Ôn ngay
          </Link>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <StatCard
          icon={GraduationCap}
          label="Từ đã học"
          tone="bg-brand-50 text-brand-700"
          value={catalog.stats.totalLearned}
        />
        <StatCard
          icon={ClockCounterClockwise}
          label="Cần ôn hôm nay"
          tone="bg-amber-50 text-amber-700"
          value={catalog.stats.dueToday}
        />
        <StatCard
          icon={Trophy}
          label="Đã thuộc"
          tone="bg-sage-100 text-sage-700"
          value={catalog.stats.mastered}
        />
      </section>

      <CategoryTabs
        activeCategory={category}
        categories={catalog.categories}
        onChange={onCategoryChange}
      />

      <section>
        <SectionHeader
          eyebrow="Thư viện từ vựng"
          title={`${catalog.collections.length} bộ từ đang sẵn sàng`}
        />
        {catalog.collections.length ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {catalog.collections.map((collection) => (
              <CollectionCard collection={collection} key={collection.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Nhóm này chưa có bộ từ đã publish. Hãy import CSV hoặc đổi bộ lọc khác."
            title="Chưa có dữ liệu"
          />
        )}
      </section>
    </div>
  );
}

function CollectionView({ collection }) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="flex min-w-0 gap-3">
          <Link
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-200 bg-white text-ink-950"
            href="/vocabulary"
          >
            <ArrowLeft size={18} weight="bold" />
          </Link>
          <div className="min-w-0">
            <p className="type-eyebrow-label">Bộ từ</p>
            <h1 className="mt-1 text-[clamp(1.7rem,3vw,2.35rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-ink-950">
              {collection.title}
            </h1>
            <p className="mt-2 max-w-3xl text-[0.94rem] leading-relaxed text-slate-500">
              {collection.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="button-primary" href={`/vocabulary/review?collection=${collection.slug}`}>
                <Play size={16} weight="fill" />
                Ôn bộ này
              </Link>
              <button className="button-secondary" onClick={developmentToast} type="button">
                <Cards size={16} weight="duotone" />
                Flashcard
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1rem] border border-sand-200 bg-white">
          <CollectionCover collection={collection} compact />
          <div className="space-y-2 p-3">
            <div className="flex items-center justify-between text-[0.82rem]">
              <span className="font-medium text-slate-500">Tiến độ</span>
              <span className="font-semibold text-ink-950">{collection.progressPercent}%</span>
            </div>
            <ProgressBar percent={collection.progressPercent} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Danh sách học"
          title={`${collection.setCount} set, ${collection.totalWordCount} từ`}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {collection.sets.map((set) => (
            <SetCard collectionSlug={collection.slug} key={set.id} set={set} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SetView({ setDetail }) {
  const [search, setSearch] = useState("");
  const filteredWords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return setDetail.words;
    }

    return setDetail.words.filter((word) =>
      [word.word, word.normalized, word.meaningVi, word.definitionEn]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [search, setDetail.words]);

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <Link
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-200 bg-white text-ink-950"
            href={`/vocabulary/${setDetail.collection.slug}`}
          >
            <ArrowLeft size={18} weight="bold" />
          </Link>
          <div className="min-w-0">
            <p className="type-eyebrow-label">{setDetail.collection.title}</p>
            <h1 className="mt-1 text-[clamp(1.55rem,2.6vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.045em] text-ink-950">
              {setDetail.title}
            </h1>
            <p className="mt-2 max-w-3xl text-[0.9rem] leading-relaxed text-slate-500">
              {setDetail.description || "Học theo từng vòng ngắn, sau đó dùng review để lặp lại đúng thời điểm."}
            </p>
          </div>
        </div>

        <Link
          className="button-primary"
          href={`/vocabulary/review?collection=${setDetail.collection.slug}&set=${setDetail.slug}`}
        >
          <Brain size={17} weight="duotone" />
          Bắt đầu ôn
        </Link>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <StatCard
          icon={BookOpenText}
          label="Tổng từ"
          tone="bg-brand-50 text-brand-700"
          value={setDetail.totalWordCount}
        />
        <StatCard
          icon={ClockCounterClockwise}
          label="Cần ôn"
          tone="bg-amber-50 text-amber-700"
          value={setDetail.dueToday}
        />
        <StatCard
          icon={Trophy}
          label="Đã thuộc"
          tone="bg-sage-100 text-sage-700"
          value={setDetail.masteredCount}
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow="Danh sách từ" title={`${filteredWords.length} từ hiển thị`} />
          <label className="field-shell lg:w-[360px]">
            <span className="sr-only">Tìm từ</span>
            <span className="relative">
              <MagnifyingGlass
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                className="field-input w-full pl-10"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm từ, nghĩa hoặc định nghĩa..."
                type="search"
                value={search}
              />
            </span>
          </label>
        </div>

        {filteredWords.length ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {filteredWords.map((word) => (
              <WordRow key={word.id} word={word} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Không có từ nào khớp với từ khóa hiện tại."
            title="Không tìm thấy từ phù hợp"
          />
        )}
      </section>
    </div>
  );
}

function ReviewView({ locale, queue, refreshQueue, searchParams }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const items = queue.items;
  const current = items[currentIndex] ?? null;

  useEffect(() => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setStartedAt(Date.now());
  }, [queue]);

  async function submitQuality(quality) {
    if (!current || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await vocabularyRepository.answer({
        quality,
        responseMs: Date.now() - startedAt,
        wordId: current.id,
      });

      if (currentIndex < items.length - 1) {
        setCurrentIndex((value) => value + 1);
        setIsRevealed(false);
        setStartedAt(Date.now());
      } else {
        await refreshQueue();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!current) {
    return (
      <div className="space-y-4">
        <Link className="button-secondary" href="/vocabulary">
          <ArrowLeft size={16} weight="bold" />
          Quay lại thư viện
        </Link>
        <EmptyState
          description="Không có từ nào đến hạn. Bạn có thể quay lại thư viện để chọn set mới."
          title="Bạn đã ôn hết rồi"
        />
      </div>
    );
  }

  const progressPercent = clampPercent(((currentIndex + 1) / Math.max(items.length, 1)) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-200 bg-white"
            onClick={() => router.push("/vocabulary")}
            type="button"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <div>
            <p className="type-eyebrow-label">Spaced repetition</p>
            <h1 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-ink-950">
              Ôn từ vựng
            </h1>
            <p className="text-[0.86rem] text-slate-500">
              {current.collectionTitle} • {current.setTitle}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-white px-3 py-1.5 text-[0.82rem] font-semibold text-slate-600">
          {currentIndex + 1}/{items.length}
        </div>
      </section>

      <ProgressBar percent={progressPercent} />

      <section className="rounded-[1.35rem] border border-sand-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(120,53,15,0.22)]">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-h-[18rem] rounded-[1rem] bg-[rgb(255,248,240)] p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[0.72rem] font-bold text-white">
                {current.partOfSpeech || "WORD"}
              </span>
              {current.progress.status !== "NEW" ? (
                <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[0.72rem] font-bold text-sage-700">
                  {STATUS_LABELS[current.progress.status]}
                </span>
              ) : null}
            </div>

            <div className="mt-10">
              <h2 className="text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-none tracking-[-0.07em] text-ink-950">
                {current.word}
              </h2>
              {getPrimaryIpa(current) ? (
                <p className="mt-3 font-mono text-[1rem] text-slate-500">{getPrimaryIpa(current)}</p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {(current.tags ?? []).slice(0, 5).map((tag) => (
                <span
                  className="rounded-full bg-white px-2.5 py-1 text-[0.74rem] font-semibold text-slate-500"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-[1rem] border border-sand-200 bg-white p-4">
            <p className="type-eyebrow-muted">Gợi ý thao tác</p>
            <div className="mt-3 space-y-3 text-[0.84rem] leading-relaxed text-slate-500">
              <p>1. Nhìn từ và tự nhớ nghĩa, ví dụ, ngữ cảnh.</p>
              <p>2. Bấm mở đáp án rồi chấm mức độ nhớ thật.</p>
              <p>3. Hệ thống tự tính lần ôn tiếp theo theo SRS.</p>
            </div>
            <button
              className="button-secondary mt-4 w-full"
              onClick={developmentToast}
              type="button"
            >
              <Headphones size={16} weight="duotone" />
              Nghe phát âm
            </button>
          </aside>
        </div>

        <div className="mt-4 rounded-[1rem] border border-sand-200 bg-white p-4">
          {isRevealed ? (
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="type-eyebrow-muted mb-1">Nghĩa tiếng Việt</p>
                <p className="text-[1rem] font-semibold text-ink-950">{current.meaningVi}</p>
              </div>
              <div>
                <p className="type-eyebrow-muted mb-1">English definition</p>
                <p className="text-[0.9rem] leading-relaxed text-slate-600">
                  {current.definitionEn}
                </p>
              </div>
              {current.exampleEn || current.exampleVi ? (
                <div className="lg:col-span-2">
                  <p className="type-eyebrow-muted mb-1">Ví dụ</p>
                  {current.exampleEn ? (
                    <p className="text-[0.9rem] text-ink-950">{current.exampleEn}</p>
                  ) : null}
                  {current.exampleVi ? (
                    <p className="mt-1 text-[0.86rem] text-slate-500">{current.exampleVi}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <button
              className="button-primary w-full"
              onClick={() => setIsRevealed(true)}
              type="button"
            >
              <Sparkle size={17} weight="duotone" />
              Mở đáp án
            </button>
          )}
        </div>

        {isRevealed ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {(["AGAIN", "HARD", "GOOD", "EASY"] as const).map((quality) => {
              const copy = QUALITY_COPY[quality];
              return (
                <button
                  className={`min-h-12 rounded-[0.95rem] border px-4 text-[0.9rem] font-bold transition disabled:opacity-55 ${copy.tone}`}
                  disabled={isSubmitting}
                  key={quality}
                  onClick={() => submitQuality(quality)}
                  type="button"
                >
                  {copy.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export function VocabularyPage() {
  const { locale: appLocale } = useAppContext();
  const locale = appLocale === "en" ? "en" : "vi";
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageRef = useRef(null);
  const collectionSlug = getParam(params.collectionSlug);
  const setSlug = getParam(params.setSlug);
  const mode = pathname === "/vocabulary/review" ? "review" : setSlug ? "set" : collectionSlug ? "collection" : "library";
  const [category, setCategory] = useState("ALL");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const reviewCollectionSlug = searchParams.get("collection") ?? undefined;
  const reviewSetSlug = searchParams.get("set") ?? undefined;

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "library") {
        setData(await vocabularyRepository.listCollections({ category, locale }));
      } else if (mode === "collection") {
        setData(await vocabularyRepository.getCollection(collectionSlug, { locale }));
      } else if (mode === "set") {
        setData(await vocabularyRepository.getSet(collectionSlug, setSlug, { locale }));
      } else {
        setData(
          await vocabularyRepository.getDue({
            collectionSlug: reviewCollectionSlug,
            limit: 30,
            locale,
            setSlug: reviewSetSlug,
          }),
        );
      }
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    load().catch((nextError) => {
      if (!cancelled) {
        setError(nextError);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, locale, category, collectionSlug, setSlug, reviewCollectionSlug, reviewSetSlug, refreshKey]);

  useEffect(() => {
    pageRef.current?.closest(".workspace-viewport")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [mode, collectionSlug, setSlug]);

  const refreshQueue = async () => {
    setRefreshKey((value) => value + 1);
  };

  if (loading) {
    return <LoadingPanel className="min-h-[440px]" lines={8} />;
  }

  if (error) {
    return (
      <ErrorState
        actionLabel="Thử lại"
        description={error.message || "Không thể tải dữ liệu từ vựng hiện tại."}
        onAction={load}
        title="Không tải được không gian từ vựng"
      />
    );
  }

  return (
    <div ref={pageRef} className="space-y-4">
      {mode === "library" ? (
        <LibraryView
          catalog={data}
          category={category}
          onCategoryChange={(nextCategory) => setCategory(nextCategory)}
        />
      ) : null}

      {mode === "collection" ? <CollectionView collection={data} /> : null}

      {mode === "set" ? <SetView setDetail={data} /> : null}

      {mode === "review" ? (
        <ReviewView
          locale={locale}
          queue={data}
          refreshQueue={refreshQueue}
          searchParams={searchParams}
        />
      ) : null}
    </div>
  );
}
