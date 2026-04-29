import {
  ArrowLeft,
  BookOpenText,
  ClockCounterClockwise,
  Headphones,
  Keyboard,
  LockSimple,
  MagnifyingGlass,
  NotePencil,
  PushPin,
  SpeakerHigh,
  Sparkle,
  SquaresFour,
  Trophy,
} from "@phosphor-icons/react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EmptyState, ErrorState, LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

const accentStyles = {
  brand: {
    button: "bg-brand-500 text-white hover:bg-brand-600",
    chip: "bg-brand-50 text-brand-700",
    icon: "bg-brand-100 text-brand-700",
    meter: "from-brand-500 via-amber-400 to-sage-600",
    ring: "border-brand-100/80",
    surface: "from-brand-50/75 via-white to-[rgb(255,248,240)]",
  },
  sage: {
    button: "bg-sage-600 text-white hover:bg-sage-700",
    chip: "bg-sage-50 text-sage-700",
    icon: "bg-sage-100 text-sage-700",
    meter: "from-sage-500 via-brand-400 to-brand-500",
    ring: "border-sage-100/80",
    surface: "from-sage-50/70 via-white to-[rgb(248,252,247)]",
  },
  slate: {
    button: "bg-slate-700 text-white hover:bg-slate-800",
    chip: "bg-slate-100 text-slate-700",
    icon: "bg-slate-100 text-slate-700",
    meter: "from-slate-500 via-slate-600 to-brand-500",
    ring: "border-slate-200",
    surface: "from-slate-50/85 via-white to-[rgb(248,250,252)]",
  },
};

const partOfSpeechTone = {
  ADJ: "bg-brand-50 text-brand-700",
  N: "bg-slate-100 text-slate-700",
  V: "bg-sage-50 text-sage-700",
};

function hashString(value) {
  return Array.from(value).reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

function resolveWordStage(word, known) {
  if (known) {
    return "known";
  }

  return hashString(word.id) % 2 === 0 ? "learning" : "unknown";
}

function formatTrackCount(copy, count) {
  return localeText(count, copy.trackSingular, copy.trackPlural);
}

function formatSetCount(copy, count) {
  return localeText(count, copy.setSingular, copy.setPlural);
}

function formatWordCount(copy, count) {
  return localeText(count, copy.wordSingular, copy.wordPlural);
}

function localeText(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getAccentStyle(accent) {
  return accentStyles[accent] ?? accentStyles.brand;
}

function BackButton({ label, onClick }) {
  return (
    <button
      className="inline-flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-sand-200 bg-white text-slate-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 active:translate-y-[1px] active:scale-[0.98]"
      onClick={onClick}
      title={label}
      type="button"
    >
      <ArrowLeft size={20} weight="bold" />
    </button>
  );
}

function VocabularyTab({ active, label, onClick }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-[0.95rem] font-semibold tracking-[-0.02em] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active
          ? "bg-brand-500 text-white shadow-[0_18px_32px_-22px_rgba(217,119,6,0.48)]"
          : "border border-sand-200 bg-white text-slate-600 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function VocabularyMeter({ accent, label, percent, valueLabel }) {
  const style = getAccentStyle(accent);

  return (
    <div className="rounded-[1.2rem] border border-white/70 bg-white/70 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <span className="text-sm font-semibold text-ink-950">{valueLabel}</span>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sand-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.meter}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function VocabularyTrackCard({ copy, track, onOpen }) {
  const style = getAccentStyle(track.accent);

  return (
    <button
      className={`group relative flex min-h-[14.5rem] w-[18.75rem] snap-start flex-col justify-between overflow-hidden rounded-[1.7rem] border bg-gradient-to-br p-5 text-left shadow-[0_24px_56px_-42px_rgba(120,53,15,0.24)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[4px] hover:shadow-[0_30px_62px_-42px_rgba(120,53,15,0.36)] ${style.ring} ${style.surface}`}
      onClick={onOpen}
      type="button"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[0.75rem] font-semibold ${style.chip}`}>
            {formatSetCount(copy, track.setCount)}
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[0.75rem] font-semibold text-slate-500">
            {formatWordCount(copy, track.totalWords)}
          </span>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-[1.35rem] font-semibold leading-[1.18] tracking-[-0.04em] text-ink-950">
            {track.title}
          </h3>
          <p className="max-w-[24ch] text-sm leading-relaxed text-slate-500">
            {copy.trackCardHint}
          </p>
        </div>
      </div>

      <VocabularyMeter
        accent={track.accent}
        label={copy.difficulty}
        percent={Math.min(100, track.difficulty * 20)}
        valueLabel={`${track.difficulty}/5`}
      />
    </button>
  );
}

function VocabularySection({ children, action, badge, description, title }) {
  return (
    <section className="surface-panel overflow-hidden p-5 sm:p-6">
      <header className="flex flex-col gap-4 border-b border-sand-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-ink-950">
              {title}
            </h2>
            {badge ? (
              <span className="rounded-full bg-brand-50 px-3 py-1 text-[0.78rem] font-semibold text-brand-700">
                {badge}
              </span>
            ) : null}
          </div>
          {description ? <p className="max-w-3xl text-sm leading-relaxed text-slate-500">{description}</p> : null}
        </div>
        {action}
      </header>

      {children}
    </section>
  );
}

function VocabularySetCard({ copy, set, index, onOpen }) {
  const progress = set.wordCount ? Math.round((set.learnedCount / set.wordCount) * 100) : 0;

  return (
    <button
      className={`flex min-h-[11.75rem] flex-col justify-between rounded-[1.55rem] border p-4 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        set.locked
          ? "cursor-not-allowed border-dashed border-sand-200 bg-[rgb(251,248,242)] text-slate-400"
          : "border-sand-200 bg-white hover:-translate-y-[2px] hover:border-brand-200 hover:shadow-[0_20px_42px_-34px_rgba(120,53,15,0.24)]"
      }`}
      disabled={set.locked}
      onClick={onOpen}
      type="button"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold ${set.locked ? "bg-sand-100 text-slate-400" : "bg-brand-50 text-brand-700"}`}>
            {index + 1}
          </div>

          <div className="flex items-center gap-2">
            {set.locked ? <LockSimple size={16} weight="fill" /> : null}
            {set.pro ? (
              <span className="rounded-full bg-[rgb(255,248,240)] px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-brand-700">
                PRO
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className={`text-[1.1rem] font-semibold leading-[1.25] tracking-[-0.03em] ${set.locked ? "text-slate-500" : "text-ink-950"}`}>
            {set.title}
          </h3>
          <p className="text-sm text-slate-500">{formatWordCount(copy, set.wordCount)}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-400">{copy.progressShort}</span>
          <span className={`font-semibold ${set.locked ? "text-slate-400" : "text-brand-700"}`}>
            {progress}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-sand-100">
          <div
            className={`h-full rounded-full ${set.locked ? "bg-sand-200" : "bg-gradient-to-r from-brand-500 to-sage-600"}`}
            style={{ width: `${set.locked ? 0 : progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}

function StudyModeCard({ description, icon: Icon, label, tone }) {
  return (
    <button
      className={`group flex min-h-[11.25rem] flex-col items-start justify-between rounded-[1.6rem] border p-5 text-left shadow-[0_20px_42px_-34px_rgba(120,53,15,0.18)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] ${tone}`}
      type="button"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-white/65 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <Icon size={22} weight="duotone" />
      </span>

      <div className="space-y-1.5">
        <h3 className="text-[1.18rem] font-semibold tracking-[-0.03em] text-ink-950">{label}</h3>
        <p className="max-w-[20ch] text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </button>
  );
}

function WordKnownSwitch({ checked, label, onChange }) {
  return (
    <button
      aria-label={label}
      aria-pressed={checked}
      className={`relative inline-flex h-8 w-14 items-center rounded-full border transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        checked ? "border-brand-200 bg-brand-100" : "border-sand-200 bg-sand-100"
      }`}
      onClick={onChange}
      type="button"
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_8px_20px_-10px_rgba(15,23,42,0.4)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function VocabularyPage() {
  const { locale } = useAppContext();
  const pageRef = useRef(null);
  const { data, error, loading } = useAsyncValue(
    () => mockContentRepository.getVocabulary(locale),
    [locale],
  );
  const [activeTab, setActiveTab] = useState("all");
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [activeSetId, setActiveSetId] = useState(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState("all");
  const [quantity, setQuantity] = useState("20");
  const [order, setOrder] = useState("original");
  const [knownState, setKnownState] = useState({});

  const copy = {
    vi: {
      all: "Tất cả",
      backToLibrary: "Quay lại lộ trình",
      backToTrack: "Quay lại bộ từ",
      customization: "Tùy chỉnh",
      detailError: "Không thể tải không gian từ vựng lúc này.",
      detailErrorDescription:
        "Dữ liệu mock cho từ vựng đang tạm thời không phản hồi. Hãy thử tải lại sau.",
      difficulty: "Độ khó",
      emptyDescription:
        "Các bộ từ sẽ xuất hiện ở đây sau khi dữ liệu nội dung được gắn vào page Từ vựng.",
      emptyTitle: "Chưa có lộ trình từ nào",
      filterAll: "Tất cả trạng thái",
      filterKnown: "Đã thuộc",
      filterLearning: "Đang học",
      filterUnknown: "Chưa thuộc",
      libraryDescription:
        "Chọn một lộ trình phù hợp với TOEIC, IELTS hoặc tự học rồi đi theo từng bộ nhỏ.",
      libraryEyebrow: "Từ vựng",
      libraryTitle: "Lộ trình học từ theo mục tiêu của bạn",
      listTitle: "Danh sách từ vựng",
      modesTitle: "Chọn chế độ học",
      noSetWordsDescription: "Bộ từ này đang chờ dữ liệu thật được gắn vào trong đợt sau.",
      noSetWordsTitle: "Bộ từ này chưa có danh sách từ",
      orderAlphabetical: "Theo chữ cái",
      orderOriginal: "Mặc định",
      orderRandom: "Ngẫu nhiên",
      orderTitle: "Thứ tự",
      pin: "Ghim",
      progressShort: "Tiến độ",
      quantityAll: "Tất cả",
      quantityTitle: "Số lượng",
      searchPlaceholder: "Tìm kiếm từ vựng...",
      setSingular: "bộ từ",
      setPlural: "bộ từ",
      setsTitle: "Các bộ từ",
      showCount: "đang hiển thị",
      startSpacedPractice: "Học ngắt quãng",
      statusTitle: "Trạng thái",
      trackCardHint: "Đi từ cụm nhỏ, giữ nhịp học ngắn và quay lại đúng phần cần ôn.",
      trackSingular: "lộ trình",
      trackPlural: "lộ trình",
      tryAgain: "Thử lại",
      vocabularyMeaning: "Nghĩa",
      vocabularyTerm: "Từ vựng",
      vocabularyToggle: "Thuộc",
      vocabularyType: "Loại từ",
      vocabularyUsage: "Ví dụ",
      wordSingular: "từ",
      wordPlural: "từ",
      modeCards: [
        {
          description: "Lật thẻ để giữ lại nghĩa và ngữ cảnh.",
          icon: BookOpenText,
          id: "flashcard",
          label: "Flashcard",
          tone: "border-brand-100 bg-[rgb(255,248,240)]",
        },
        {
          description: "Ôn nhanh bằng câu hỏi ngắn và đáp án rõ.",
          icon: NotePencil,
          id: "quiz",
          label: "Quiz",
          tone: "border-amber-100 bg-[rgb(255,250,239)]",
        },
        {
          description: "Nghe từ rồi nhắc lại để giữ âm thanh chính xác.",
          icon: Headphones,
          id: "listening",
          label: "Listening",
          tone: "border-sage-100 bg-[rgb(247,252,248)]",
        },
        {
          description: "Nhìn nghĩa và gõ từ theo nhịp ngắn.",
          icon: Keyboard,
          id: "typing",
          label: "Typing",
          tone: "border-slate-200 bg-[rgb(248,250,252)]",
        },
        {
          description: "Ghép từ với nghĩa hoặc ví dụ tương ứng.",
          icon: SquaresFour,
          id: "matching",
          label: "Ghép cặp",
          tone: "border-[rgb(231,220,204)] bg-[rgb(255,252,247)]",
        },
        {
          description: "Trộn nhiều cách ôn trong một vòng học gọn.",
          icon: Sparkle,
          id: "mixed",
          label: "Tổng hợp",
          tone: "border-brand-200 bg-[rgb(255,246,232)]",
        },
      ],
    },
    en: {
      all: "All",
      backToLibrary: "Back to tracks",
      backToTrack: "Back to track",
      customization: "Controls",
      detailError: "We couldn't load the vocabulary space right now.",
      detailErrorDescription:
        "The mock vocabulary data is temporarily unavailable. Please try again later.",
      difficulty: "Difficulty",
      emptyDescription:
        "Vocabulary tracks will appear here once the content set is connected to this page.",
      emptyTitle: "No vocabulary tracks yet",
      filterAll: "All statuses",
      filterKnown: "Known",
      filterLearning: "Learning",
      filterUnknown: "Unknown",
      libraryDescription:
        "Choose a track that fits TOEIC, IELTS, or self-study, then move through smaller sets.",
      libraryEyebrow: "Vocabulary",
      libraryTitle: "Vocabulary tracks by learning goal",
      listTitle: "Vocabulary list",
      modesTitle: "Choose a study mode",
      noSetWordsDescription: "This set is waiting for real content in the next update.",
      noSetWordsTitle: "This set has no words yet",
      orderAlphabetical: "Alphabetical",
      orderOriginal: "Default",
      orderRandom: "Random",
      orderTitle: "Order",
      pin: "Pin",
      progressShort: "Progress",
      quantityAll: "All",
      quantityTitle: "Quantity",
      searchPlaceholder: "Search vocabulary...",
      setSingular: "set",
      setPlural: "sets",
      setsTitle: "Vocabulary sets",
      showCount: "visible",
      startSpacedPractice: "Spaced practice",
      statusTitle: "Status",
      trackCardHint: "Move through small sets, keep sessions short, and revisit the right words.",
      trackSingular: "track",
      trackPlural: "tracks",
      tryAgain: "Try again",
      vocabularyMeaning: "Meaning",
      vocabularyTerm: "Vocabulary",
      vocabularyToggle: "Known",
      vocabularyType: "Type",
      vocabularyUsage: "Example",
      wordSingular: "word",
      wordPlural: "words",
      modeCards: [
        {
          description: "Flip cards to keep the meaning and context in memory.",
          icon: BookOpenText,
          id: "flashcard",
          label: "Flashcard",
          tone: "border-brand-100 bg-[rgb(255,248,240)]",
        },
        {
          description: "Review quickly through short prompts and clear answers.",
          icon: NotePencil,
          id: "quiz",
          label: "Quiz",
          tone: "border-amber-100 bg-[rgb(255,250,239)]",
        },
        {
          description: "Hear the word and repeat it with cleaner sound memory.",
          icon: Headphones,
          id: "listening",
          label: "Listening",
          tone: "border-sage-100 bg-[rgb(247,252,248)]",
        },
        {
          description: "See the meaning and type the word in a short burst.",
          icon: Keyboard,
          id: "typing",
          label: "Typing",
          tone: "border-slate-200 bg-[rgb(248,250,252)]",
        },
        {
          description: "Match the word to its meaning or example.",
          icon: SquaresFour,
          id: "matching",
          label: "Matching",
          tone: "border-[rgb(231,220,204)] bg-[rgb(255,252,247)]",
        },
        {
          description: "Blend multiple study patterns inside one compact round.",
          icon: Sparkle,
          id: "mixed",
          label: "Mixed",
          tone: "border-brand-200 bg-[rgb(255,246,232)]",
        },
      ],
    },
  }[locale];

  const tabs = useMemo(
    () => [
      { id: "all", label: copy.all },
      { id: "toeic", label: "TOEIC" },
      { id: "ielts", label: "IELTS" },
      { id: "self-study", label: locale === "vi" ? "Tự học" : "Self-study" },
    ],
    [copy.all, locale],
  );

  const sections = data?.sections ?? [];

  const allTracks = useMemo(
    () => sections.flatMap((section) => section.tracks),
    [sections],
  );

  const activeTrack = useMemo(
    () => allTracks.find((track) => track.id === activeTrackId) ?? null,
    [activeTrackId, allTracks],
  );

  const activeSet = useMemo(
    () => activeTrack?.sets.find((set) => set.id === activeSetId) ?? null,
    [activeSetId, activeTrack],
  );

  const visibleSections = useMemo(() => {
    if (activeTab === "all") {
      return sections;
    }

    return sections.filter((section) => section.id === activeTab);
  }, [activeTab, sections]);

  const activeWords = useMemo(() => {
    if (!activeSet) {
      return [];
    }

    return activeSet.words.map((word, index) => {
      const known = knownState[word.id] ?? word.known;

      return {
        ...word,
        known,
        sourceIndex: index,
        stage: resolveWordStage(word, known),
      };
    });
  }, [activeSet, knownState]);

  const filteredWords = useMemo(() => {
    const needle = deferredSearch.trim().toLowerCase();

    let nextWords = activeWords.filter((word) => {
      if (statusFilter !== "all" && word.stage !== statusFilter) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return `${word.term} ${word.meaning} ${word.example} ${word.phonetic}`
        .toLowerCase()
        .includes(needle);
    });

    if (order === "alphabetical") {
      nextWords = [...nextWords].sort((left, right) => left.term.localeCompare(right.term));
    } else if (order === "random") {
      nextWords = [...nextWords].sort(
        (left, right) => hashString(left.id) - hashString(right.id),
      );
    } else {
      nextWords = [...nextWords].sort((left, right) => left.sourceIndex - right.sourceIndex);
    }

    if (quantity !== "all") {
      nextWords = nextWords.slice(0, Number(quantity));
    }

    return nextWords;
  }, [activeWords, deferredSearch, order, quantity, statusFilter]);

  useEffect(() => {
    if (activeTrackId && sections.length > 0 && !activeTrack) {
      setActiveTrackId(null);
    }
  }, [activeTrack, activeTrackId, sections.length]);

  useEffect(() => {
    if (activeSetId && activeTrack && activeTrack.sets.length > 0 && !activeSet) {
      setActiveSetId(null);
    }
  }, [activeSet, activeSetId, activeTrack]);

  useEffect(() => {
    if (!activeSet) {
      return;
    }

    setSearch("");
    setStatusFilter("all");
    setQuantity("20");
    setOrder("original");
    setKnownState(
      Object.fromEntries(activeSet.words.map((word) => [word.id, word.known])),
    );
  }, [activeSet]);

  useEffect(() => {
    const viewport = pageRef.current?.closest(".workspace-viewport");

    viewport?.scrollTo({ behavior: "smooth", left: 0, top: 0 });
  }, [activeSetId, activeTab, activeTrackId]);

  const handleOpenTrack = (trackId) => {
    startTransition(() => {
      setActiveTrackId(trackId);
      setActiveSetId(null);
    });
  };

  const handleOpenSet = (setId) => {
    startTransition(() => {
      setActiveSetId(setId);
    });
  };

  const handleBackToLibrary = () => {
    startTransition(() => {
      setActiveTrackId(null);
      setActiveSetId(null);
    });
  };

  const handleBackToTrack = () => {
    startTransition(() => {
      setActiveSetId(null);
    });
  };

  const handleStartSpacedPractice = () => {
    const firstAvailableSet = activeTrack?.sets.find((set) => !set.locked);

    if (!firstAvailableSet) {
      return;
    }

    handleOpenSet(firstAvailableSet.id);
  };

  const handleToggleKnown = (wordId) => {
    setKnownState((current) => ({
      ...current,
      [wordId]: !(current[wordId] ?? false),
    }));
  };

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={9} />;
  }

  if (error) {
    return (
      <ErrorState
        actionLabel={copy.tryAgain}
        description={copy.detailErrorDescription}
        title={copy.detailError}
      />
    );
  }

  if (sections.length === 0) {
    return <EmptyState description={copy.emptyDescription} title={copy.emptyTitle} />;
  }

  return (
    <div ref={pageRef} className="space-y-5">
      {!activeTrack ? (
        <>
          <section className="surface-panel px-5 py-6 sm:px-6 lg:px-7">
            <div className="space-y-5 text-center">
              <div className="space-y-3">
                <p className="type-eyebrow-label">{copy.libraryEyebrow}</p>
                <div className="space-y-2.5">
                  <h1 className="mx-auto max-w-[13ch] text-[clamp(2.4rem,4vw,3.45rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-ink-950">
                    {copy.libraryTitle}
                  </h1>
                  <p className="mx-auto max-w-2xl text-[0.98rem] leading-[1.68] text-slate-500">
                    {copy.libraryDescription}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {tabs.map((tab) => (
                  <VocabularyTab
                    key={tab.id}
                    active={activeTab === tab.id}
                    label={tab.label}
                    onClick={() => {
                      startTransition(() => {
                        setActiveTab(tab.id);
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-5">
            {visibleSections.map((section) => (
              <VocabularySection
                key={section.id}
                badge={formatTrackCount(copy, section.tracks.length)}
                description={section.description}
                title={section.title}
              >
                <div className="scrollbar-hidden -mx-1 mt-5 overflow-x-auto pb-1">
                  <div className="flex gap-4 px-1">
                    {section.tracks.map((track) => (
                      <VocabularyTrackCard
                        key={track.id}
                        copy={copy}
                        onOpen={() => handleOpenTrack(track.id)}
                        track={track}
                      />
                    ))}
                  </div>
                </div>
              </VocabularySection>
            ))}
          </div>
        </>
      ) : null}

      {activeTrack && !activeSet ? (
        <>
          <section className="surface-panel p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <BackButton label={copy.backToLibrary} onClick={handleBackToLibrary} />

                  <div className="min-w-0 space-y-3">
                    <h1 className="max-w-[18ch] text-[clamp(2rem,3.2vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-ink-950">
                      {activeTrack.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[0.8125rem] font-semibold ${getAccentStyle(activeTrack.accent).chip}`}>
                        {formatSetCount(copy, activeTrack.setCount)}
                      </span>
                      <span className="rounded-full bg-sage-50 px-3 py-1 text-[0.8125rem] font-semibold text-sage-700">
                        {formatWordCount(copy, activeTrack.totalWords)}
                      </span>
                      <span className="rounded-full bg-[rgb(255,248,240)] px-3 py-1 text-[0.8125rem] font-semibold text-brand-700">
                        {activeTrack.completion}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="button-secondary justify-center" type="button">
                    <PushPin size={18} weight="duotone" />
                    {copy.pin}
                  </button>
                  <button className="button-secondary justify-center" type="button">
                    <Trophy size={18} weight="duotone" />
                    {locale === "vi" ? "BXH" : "Rank"}
                  </button>
                  <button
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${getAccentStyle(activeTrack.accent).button}`}
                    onClick={handleStartSpacedPractice}
                    type="button"
                  >
                    <ClockCounterClockwise size={18} weight="duotone" />
                    {copy.startSpacedPractice}
                  </button>
                </div>
              </div>

              <div className="space-y-3 rounded-[1.55rem] border border-sand-200 bg-[rgb(255,248,240)] px-4 py-4">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span>{copy.progressShort}</span>
                  <span className="font-semibold text-ink-950">
                    {activeTrack.learnedWords}/{activeTrack.totalWords}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-sand-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getAccentStyle(activeTrack.accent).meter}`}
                    style={{ width: `${activeTrack.completion}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <VocabularySection
            action={
              <span className="rounded-full bg-brand-50 px-3 py-1 text-[0.8rem] font-semibold text-brand-700">
                {formatSetCount(copy, activeTrack.setCount)}
              </span>
            }
            description={locale === "vi" ? "Đi theo từng bộ nhỏ để giữ nhịp đều và quay lại đúng phần cần ôn." : "Move through small sets so practice stays short and easy to revisit."}
            title={copy.setsTitle}
          >
            <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
              {activeTrack.sets.map((set, index) => (
                <VocabularySetCard
                  key={set.id}
                  copy={copy}
                  index={index}
                  onOpen={() => handleOpenSet(set.id)}
                  set={set}
                />
              ))}
            </div>
          </VocabularySection>
        </>
      ) : null}

      {activeTrack && activeSet ? (
        <>
          <section className="surface-panel p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex min-w-0 gap-4">
                <BackButton label={copy.backToTrack} onClick={handleBackToTrack} />

                <div className="min-w-0 space-y-3">
                  <h1 className="max-w-[20ch] text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-ink-950">
                    {activeSet.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-[0.8125rem] font-semibold text-brand-700">
                      {formatWordCount(copy, activeSet.wordCount)}
                    </span>
                    <span className="rounded-full bg-sage-50 px-3 py-1 text-[0.8125rem] font-semibold text-sage-700">
                      {activeSet.learnedCount}/{activeSet.wordCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-[1.55rem] border border-sand-200 bg-[rgb(255,248,240)] px-4 py-4">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span>{copy.progressShort}</span>
                  <span className="font-semibold text-ink-950">
                    {Math.round((activeSet.learnedCount / activeSet.wordCount) * 100)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-sand-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                    style={{
                      width: `${Math.round((activeSet.learnedCount / activeSet.wordCount) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <VocabularySection
            action={
              <span className="rounded-full bg-brand-100 px-3.5 py-1.5 text-sm font-semibold text-brand-700">
                {filteredWords.length}/{activeSet.wordCount} {copy.showCount}
              </span>
            }
            description={locale === "vi" ? "Giữ các bộ lọc nhẹ và quay lại đúng nhóm từ cần ôn trước." : "Keep the controls light and return to the exact word group that needs another pass."}
            title={copy.customization}
          >
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <label className="field-shell">
                <span className="field-label">{copy.statusTitle}</span>
                <select
                  className="field-input appearance-none"
                  onChange={(event) => setStatusFilter(event.target.value)}
                  value={statusFilter}
                >
                  <option value="all">{copy.filterAll}</option>
                  <option value="unknown">{copy.filterUnknown}</option>
                  <option value="learning">{copy.filterLearning}</option>
                  <option value="known">{copy.filterKnown}</option>
                </select>
              </label>

              <label className="field-shell">
                <span className="field-label">{copy.quantityTitle}</span>
                <select
                  className="field-input appearance-none"
                  onChange={(event) => setQuantity(event.target.value)}
                  value={quantity}
                >
                  <option value="10">10 {copy.wordPlural}</option>
                  <option value="20">20 {copy.wordPlural}</option>
                  <option value="all">{copy.quantityAll}</option>
                </select>
              </label>

              <label className="field-shell">
                <span className="field-label">{copy.orderTitle}</span>
                <select
                  className="field-input appearance-none"
                  onChange={(event) => setOrder(event.target.value)}
                  value={order}
                >
                  <option value="original">{copy.orderOriginal}</option>
                  <option value="alphabetical">{copy.orderAlphabetical}</option>
                  <option value="random">{copy.orderRandom}</option>
                </select>
              </label>
            </div>
          </VocabularySection>

          <VocabularySection
            description={locale === "vi" ? "Các khối này đang là shell frontend để chuẩn bị cho vòng luyện sâu hơn sau khi có dữ liệu thật." : "These cards are frontend shells for deeper study flows once the real data is attached."}
            title={copy.modesTitle}
          >
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {copy.modeCards.map((mode) => (
                <StudyModeCard
                  key={mode.id}
                  description={mode.description}
                  icon={mode.icon}
                  label={mode.label}
                  tone={mode.tone}
                />
              ))}
            </div>
          </VocabularySection>

          <VocabularySection
            action={
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.78rem] font-semibold text-slate-600">
                {formatWordCount(copy, activeSet.wordCount)}
              </span>
            }
            title={copy.listTitle}
          >
            {activeWords.length === 0 ? (
              <div className="mt-5">
                <EmptyState description={copy.noSetWordsDescription} title={copy.noSetWordsTitle} />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
                  <label className="field-shell">
                    <span className="sr-only">{copy.listTitle}</span>
                    <span className="relative">
                      <MagnifyingGlass
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        className="field-input pl-11"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={copy.searchPlaceholder}
                        type="search"
                        value={search}
                      />
                    </span>
                  </label>

                  <label className="field-shell">
                    <span className="sr-only">{copy.statusTitle}</span>
                    <select
                      className="field-input appearance-none"
                      onChange={(event) => setStatusFilter(event.target.value)}
                      value={statusFilter}
                    >
                      <option value="all">{copy.filterAll}</option>
                      <option value="unknown">{copy.filterUnknown}</option>
                      <option value="learning">{copy.filterLearning}</option>
                      <option value="known">{copy.filterKnown}</option>
                    </select>
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left">
                    <thead className="bg-[rgb(255,248,240)] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <tr>
                        <th className="px-4 py-3.5">{copy.vocabularyTerm}</th>
                        <th className="px-4 py-3.5">{copy.vocabularyMeaning}</th>
                        <th className="px-4 py-3.5">{copy.vocabularyType}</th>
                        <th className="px-4 py-3.5">{copy.vocabularyUsage}</th>
                        <th className="px-4 py-3.5">{copy.vocabularyToggle}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWords.map((word) => (
                        <tr key={word.id} className="border-t border-sand-200 align-top">
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <button
                                aria-label={word.term}
                                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-sand-200 bg-white text-slate-500 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950"
                                type="button"
                              >
                                <SpeakerHigh size={16} weight="duotone" />
                              </button>

                              <div className="space-y-1">
                                <p className="text-[1.02rem] font-semibold text-ink-950">{word.term}</p>
                                <p className="text-sm text-slate-400">{word.phonetic}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="max-w-[20ch] text-sm font-medium leading-relaxed text-ink-950">
                              {word.meaning}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-[0.78rem] font-semibold ${partOfSpeechTone[word.partOfSpeech] ?? "bg-slate-100 text-slate-700"}`}>
                              {word.partOfSpeech}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="max-w-[34ch] text-sm leading-relaxed text-slate-500">
                              {word.example}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <WordKnownSwitch
                              checked={word.known}
                              label={`${copy.vocabularyToggle}: ${word.term}`}
                              onChange={() => handleToggleKnown(word.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredWords.length === 0 ? (
                  <EmptyState
                    description={locale === "vi" ? "Không có từ nào khớp với bộ lọc hiện tại." : "No words match the current filter."}
                    title={locale === "vi" ? "Không tìm thấy từ phù hợp" : "No matching words"}
                  />
                ) : null}
              </div>
            )}
          </VocabularySection>
        </>
      ) : null}
    </div>
  );
}
