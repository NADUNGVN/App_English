import {
  ArrowRight,
  BookOpenText,
  ChartLineUp,
  CheckCircle,
  PlayCircle,
  Quotes,
  SpeakerSimpleHigh,
  Subtitles,
  TrendUp,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext.js";

export function LandingPage() {
  const { locale } = useAppContext();

  const copy = {
    vi: {
      eyebrow: "Luyện tiếng Anh mỗi ngày, rõ ràng và bền nhịp",
      title: "Nghe kỹ hơn, nói chắc hơn, giữ nhịp học ngắn mỗi ngày.",
      intro:
        "QuackUp tập trung vào dictation, shadowing, và vốn từ đi cùng ngữ cảnh thật. Mỗi buổi học đủ ngắn để bạn quay lại vào ngày mai.",
      primaryCta: "Bắt đầu miễn phí ngay",
      secondaryCta: "Xem không gian học",
      supportList: [
        "Buổi học ngắn dưới 10 phút để bạn quay lại đều hơn.",
        "Dictation và shadowing đi cùng một nhịp học, không bị tách rời.",
        "Nguồn nội dung từ BBC, CNN, TED-Ed và các clip ngắn dễ vào việc.",
      ],
      heroCardTitle: "Buổi học hôm nay",
      heroCardCopy: "Chọn một clip ngắn, chép câu nghe được, rồi đọc theo để khóa nhịp nói.",
      heroStats: [
        { label: "Chuỗi học", value: "07 ngày" },
        { label: "Độ chính xác", value: "92%" },
        { label: "Từ đang ôn", value: "18 mục" },
      ],
      practiceTitle: "Hai chế độ luyện tập bổ trợ nhau rất tốt.",
      practiceCopy:
        "Dictation giúp bạn nghe kỹ từng âm. Shadowing giúp bạn giữ nhịp, trọng âm, và phản xạ miệng. Từ vựng được kéo thẳng từ các buổi luyện vào danh sách ôn.",
      practiceBlocks: [
        {
          title: "Dictation",
          body: "Nghe theo từng câu, chép lại phần còn thiếu, và đối chiếu ngay khi hoàn thành.",
        },
        {
          title: "Shadowing",
          body: "Lặp lại sau người nói bằng từng cụm ngắn để giữ nhịp và độ tự nhiên.",
        },
        {
          title: "Vocabulary",
          body: "Ghim lại cụm từ xuất hiện trong clip để ôn đúng thứ bạn vừa gặp.",
        },
      ],
      libraryTitle: "Thư viện học liệu đủ gọn để bạn chọn nhanh.",
      libraryCopy:
        "Mỗi bài học được đóng gói theo độ dài, mức độ, nguồn, và loại kỹ năng đang luyện để bạn vào việc nhanh hơn.",
      resultsTitle: "Kết quả nên nhìn thấy được sau từng buổi học.",
      resultsCopy:
        "Tổng quan theo ngày, mức độ chính xác, thời lượng luyện tập, và danh sách nội dung cần quay lại đều nằm trong cùng một nơi.",
      metrics: [
        { label: "Bài học ngắn", value: "500+" },
        { label: "Nguồn nội dung", value: "BBC · CNN · TED-Ed" },
        { label: "Thời lượng lý tưởng", value: "5-10 phút" },
      ],
    },
    en: {
      eyebrow: "Daily English practice with a clear and steady rhythm",
      title: "Listen more precisely, speak more steadily, and keep practice short enough to repeat.",
      intro:
        "QuackUp focuses on dictation, shadowing, and vocabulary that stays attached to real context. Every session is short enough to come back to tomorrow.",
      primaryCta: "Start free now",
      secondaryCta: "View the study space",
      supportList: [
        "Short sessions under ten minutes so practice stays repeatable.",
        "Dictation and shadowing stay connected inside one practice rhythm.",
        "Content comes from BBC, CNN, TED-Ed, and compact clips that are easy to start.",
      ],
      heroCardTitle: "Today's session",
      heroCardCopy: "Pick a short clip, write down what you hear, then mirror it back to lock in the rhythm.",
      heroStats: [
        { label: "Practice streak", value: "07 days" },
        { label: "Accuracy", value: "92%" },
        { label: "Words in review", value: "18 items" },
      ],
      practiceTitle: "Two practice modes that strengthen each other.",
      practiceCopy:
        "Dictation sharpens what you hear. Shadowing steadies rhythm, stress, and mouth memory. Vocabulary is pulled directly from the clips you practice with.",
      practiceBlocks: [
        {
          title: "Dictation",
          body: "Listen line by line, fill the missing words, and compare immediately after each attempt.",
        },
        {
          title: "Shadowing",
          body: "Repeat after the speaker in short chunks so rhythm and pace stay natural.",
        },
        {
          title: "Vocabulary",
          body: "Save the phrases that appear inside each clip and review the same language later.",
        },
      ],
      libraryTitle: "A lesson library that stays fast to choose from.",
      libraryCopy:
        "Every lesson is packaged by duration, level, source, and skill focus so you can start without browsing forever.",
      resultsTitle: "Progress should be visible after each session.",
      resultsCopy:
        "Daily summaries, accuracy, study time, and the list of content worth revisiting all live in one place.",
      metrics: [
        { label: "Short lessons", value: "500+" },
        { label: "Content sources", value: "BBC · CNN · TED-Ed" },
        { label: "Ideal duration", value: "5-10 minutes" },
      ],
    },
  }[locale];

  return (
    <div>
      <section className="bg-hero-wash">
        <div className="page-shell grid gap-10 pb-14 pt-8 lg:min-h-[calc(100dvh-84px)] lg:grid-cols-[minmax(0,0.92fr),minmax(540px,1.08fr)] lg:items-start lg:gap-12 lg:pb-20 lg:pt-14">
          <div className="max-w-[39rem] space-y-7 lg:pt-10">
            <span className="eyebrow">
              <TrendUp size={16} weight="duotone" />
              {copy.eyebrow}
            </span>

            <div className="space-y-4">
              <h1 className="display-title max-w-[10.5ch] text-[3.5rem] sm:text-[4.35rem] lg:text-[5.15rem]">
                {copy.title}
              </h1>
              <p className="max-w-[35rem] text-lg leading-relaxed text-slate-600">{copy.intro}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link className="button-primary" to="/register">
                {copy.primaryCta}
                <ArrowRight size={18} weight="bold" />
              </Link>
              <Link className="button-secondary" to="/login">
                <PlayCircle size={18} weight="duotone" />
                {copy.secondaryCta}
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {copy.supportList.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-600">
                  <CheckCircle className="mt-0.5 shrink-0 text-sage-700" size={18} weight="fill" />
                  <p className="max-w-[34rem]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pt-4">
            <div className="surface-panel relative overflow-hidden p-4 sm:p-5 lg:p-6">
              <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-brand-100/70 blur-3xl" />
              <div className="absolute -left-10 bottom-4 h-36 w-36 rounded-full bg-sage-100/55 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4 rounded-[1.65rem] border border-white/80 bg-white/85 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {copy.heroCardTitle}
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                      {copy.heroCardCopy}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_18px_30px_-20px_rgba(217,119,6,0.52)]">
                    <PlayCircle size={24} weight="duotone" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1.08fr),228px]">
                  <div className="surface-panel-soft relative min-h-[390px] overflow-hidden p-4 sm:p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(15,118,110,0.12),transparent_36%)]" />
                    <div className="relative flex h-full items-center justify-center">
                      <div className="rounded-[1.65rem] border border-white/85 bg-[rgb(255,248,240)] p-4 shadow-[0_26px_48px_-34px_rgba(120,53,15,0.36)]">
                        <img
                          alt="QuackUp mascot"
                          className="h-[280px] w-[280px] animate-drift object-contain sm:h-[308px] sm:w-[308px]"
                          src="/quackup-mascot-cream.png"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {copy.heroStats.map((item) => (
                      <div
                        key={item.label}
                        className="surface-panel-soft flex min-h-[118px] items-center justify-between px-5 py-5"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-ink-950">
                            {item.value}
                          </p>
                        </div>
                        <div className="h-11 w-11 rounded-full border border-white/80 bg-white/90 shadow-[0_18px_28px_-24px_rgba(120,53,15,0.24)]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20" id="practice">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
          <div className="space-y-5">
            <span className="eyebrow">
              <Quotes size={16} weight="duotone" />
              {locale === "vi" ? "Cách học" : "Practice design"}
            </span>
            <h2 className="section-title max-w-xl">{copy.practiceTitle}</h2>
            <p className="section-copy">{copy.practiceCopy}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
            <div className="surface-panel p-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-4 rounded-[1.4rem] border border-sand-200 bg-white/60 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                    <Subtitles size={22} weight="duotone" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold tracking-[-0.03em] text-ink-950">
                      {copy.practiceBlocks[0].title}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-500">{copy.practiceBlocks[0].body}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-[1.4rem] border border-sand-200 bg-white/60 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <SpeakerSimpleHigh size={22} weight="duotone" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold tracking-[-0.03em] text-ink-950">
                      {copy.practiceBlocks[1].title}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-500">{copy.practiceBlocks[1].body}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-panel flex flex-col justify-between p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-brand-700">
                <BookOpenText size={22} weight="duotone" />
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold tracking-[-0.03em] text-ink-950">
                  {copy.practiceBlocks[2].title}
                </p>
                <p className="text-sm leading-relaxed text-slate-500">{copy.practiceBlocks[2].body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20" id="library">
        <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="surface-panel p-8">
            <span className="eyebrow">
              <BookOpenText size={16} weight="duotone" />
              {locale === "vi" ? "Thư viện bài học" : "Lesson library"}
            </span>
            <div className="mt-6 space-y-4">
              <h2 className="section-title max-w-2xl">{copy.libraryTitle}</h2>
              <p className="section-copy">{copy.libraryCopy}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {copy.metrics.map((item) => (
              <div key={item.label} className="surface-panel-soft flex items-center justify-between p-5">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="text-xl font-semibold tracking-[-0.04em] text-ink-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-20" id="results">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="space-y-5">
            <span className="eyebrow">
              <ChartLineUp size={16} weight="duotone" />
              {locale === "vi" ? "Tiến bộ" : "Progress"}
            </span>
            <h2 className="section-title max-w-xl">{copy.resultsTitle}</h2>
            <p className="section-copy">{copy.resultsCopy}</p>
          </div>

          <div className="surface-panel overflow-hidden p-6">
            <div className="grid gap-4 md:grid-cols-[0.9fr,1.1fr]">
              <div className="rounded-[1.5rem] border border-sand-200 bg-white/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {locale === "vi" ? "Nhịp tuần này" : "This week's rhythm"}
                </p>
                <div className="mt-5 space-y-3">
                  {[18, 26, 34, 22, 29].map((value, index) => (
                    <div key={`bar-${value}`} className="grid grid-cols-[52px,1fr] items-center gap-3">
                      <span className="text-sm text-slate-400">{["Mon", "Tue", "Wed", "Thu", "Fri"][index]}</span>
                      <div className="h-3 overflow-hidden rounded-full bg-sand-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                          style={{ width: `${value * 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-sand-200 bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {locale === "vi" ? "Điểm mạnh gần đây" : "Recent strengths"}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-slate-500">
                    <p>
                      {locale === "vi"
                        ? "Bạn giữ được nhịp học đều trong bảy ngày gần nhất."
                        : "You kept a steady practice rhythm across the last seven days."}
                    </p>
                    <p>
                      {locale === "vi"
                        ? "Các câu dictation ngắn đang đạt độ chính xác rất tốt."
                        : "Short dictation lines are landing with strong accuracy."}
                    </p>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-sand-200 bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {locale === "vi" ? "Gợi ý tiếp theo" : "Next move"}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    {locale === "vi"
                      ? "Giữ dictation dưới 8 phút, sau đó dành 3 phút nhắc lại các câu khó bằng shadowing."
                      : "Keep dictation under eight minutes, then spend three minutes repeating the tougher lines aloud."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
