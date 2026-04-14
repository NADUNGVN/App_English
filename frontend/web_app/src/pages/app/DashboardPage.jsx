import { ArrowRight, ClockCounterClockwise, Ranking, Sparkle } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  WorkspaceCanvas,
  WorkspaceSection,
  WorkspaceSectionHeader,
} from "../../components/app/WorkspaceCanvas.jsx";
import { LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function DashboardPage() {
  const { locale, user } = useAppContext();
  const { data, loading } = useAsyncValue(
    () => mockContentRepository.getDashboard(locale, user),
    [locale, user?.id],
  );

  const goalProgress = useMemo(() => {
    const minutes = 24;
    return Math.min(100, Math.round((minutes / (user?.dailyGoalMinutes ?? 30)) * 100));
  }, [user?.dailyGoalMinutes]);

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  return (
    <WorkspaceCanvas>
      <WorkspaceSection className="border-b border-sand-200">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),300px] xl:items-start">
          <div className="space-y-3">
            <p className="type-eyebrow-label">
              {locale === "vi" ? "Nhịp hôm nay" : "Today's rhythm"}
            </p>
            <div className="space-y-2.5">
              <h2 className="type-display-auth max-w-[13ch]">{data.heading}</h2>
              <p className="type-body-md max-w-2xl">{data.summary}</p>
            </div>
          </div>

          <div className="rounded-[1.55rem] border border-white/80 bg-[rgb(255,248,240)] px-4 py-4 shadow-[0_22px_40px_-34px_rgba(120,53,15,0.24)]">
            <p className="type-eyebrow-muted">
              {locale === "vi" ? "Mục tiêu ngày" : "Daily target"}
            </p>
            <div className="mt-3.5 space-y-2.5">
              <p className="type-stat-value">{goalProgress}%</p>
              <div className="h-3 overflow-hidden rounded-full bg-sand-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <p className="type-body-sm">
                {locale === "vi"
                  ? `Bạn đã hoàn thành 24 trên ${user?.dailyGoalMinutes ?? 15} phút.`
                  : `You have completed 24 of ${user?.dailyGoalMinutes ?? 15} minutes.`}
              </p>
            </div>
          </div>
        </div>
      </WorkspaceSection>

      <section className="grid border-b border-sand-200 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x xl:divide-sand-200">
        {data.stats.map((item, index) => (
          <div
            key={item.label}
            className={`px-4 py-4 sm:px-5 lg:px-6 ${index > 0 ? "border-t border-sand-200 sm:border-t-0" : ""}`}
          >
            <p className="type-eyebrow-muted">{item.label}</p>
            <p className="type-stat-value mt-3">{item.value}</p>
            <p className="type-body-sm mt-2">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-[minmax(0,1.05fr),320px]">
        <div className="min-w-0 border-b border-sand-200 lg:border-b-0 lg:border-r lg:border-sand-200">
          <WorkspaceSection className="border-b border-sand-200">
            <WorkspaceSectionHeader
              action={
                <Link className="button-secondary shrink-0" to="/learning">
                  {locale === "vi" ? "Mở thư viện" : "Open library"}
                  <ArrowRight size={18} weight="bold" />
                </Link>
              }
              eyebrow={locale === "vi" ? "Tiếp tục luyện" : "Continue practicing"}
              title={locale === "vi" ? "Ba bài phù hợp nhất lúc này" : "Three sessions that fit right now"}
            />
          </WorkspaceSection>

          <div className="divide-y divide-sand-200">
            {data.focusList.map((lesson) => (
              <article key={lesson.id} className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="type-body-sm font-semibold text-brand-700">
                      {lesson.source} · {lesson.level}
                    </p>
                    <h3 className="type-title-section max-w-[22ch]">{lesson.title}</h3>
                    <p className="type-body-sm max-w-[60ch]">{lesson.description}</p>
                  </div>
                  <div className="type-body-sm shrink-0 text-right font-medium text-slate-400">{lesson.minutes}m</div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="type-body-sm">{lesson.tag}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-28 overflow-hidden rounded-full bg-sand-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                    <span className="type-control-label text-ink-950">{lesson.progress}%</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <WorkspaceSection className="border-b border-sand-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <ClockCounterClockwise size={20} weight="duotone" />
              </div>
              <div>
                <p className="type-eyebrow-muted">
                  {locale === "vi" ? "Hoạt động gần đây" : "Recent activity"}
                </p>
                <h3 className="type-title-section">
                  {locale === "vi" ? "Những gì vừa được lưu lại" : "What was just saved"}
                </h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {data.activity.map((item) => (
                <div key={item.title} className="border-t border-sand-200 pt-4 first:border-t-0 first:pt-0">
                  <p className="type-body-sm font-medium text-ink-950">{item.title}</p>
                  <p className="type-body-sm mt-1">{item.time}</p>
                </div>
              ))}
            </div>
          </WorkspaceSection>

          <WorkspaceSection className="border-b border-sand-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Ranking size={20} weight="duotone" />
              </div>
              <div>
                <p className="type-eyebrow-muted">
                  {locale === "vi" ? "Nhóm dẫn đầu" : "Top learners"}
                </p>
                <h3 className="type-title-section">
                  {locale === "vi" ? "Bạn đang đứng gần nhóm đầu" : "You are close to the front group"}
                </h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {data.leaderboard.map((row) => (
                <div key={row.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="type-body-sm font-semibold text-ink-950">{row.name}</p>
                    <p className="type-body-sm">
                      {row.minutes} min · {row.streak} {locale === "vi" ? "ngày" : "days"}
                    </p>
                  </div>
                  <span className="type-control-label rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                    #{row.rank}
                  </span>
                </div>
              ))}
            </div>
          </WorkspaceSection>

          <WorkspaceSection className="bg-[rgb(255,248,240)]/62">
            <div className="flex items-start gap-3">
              <Sparkle className="mt-1 shrink-0 text-brand-700" size={20} weight="duotone" />
              <p className="type-body-sm">
                {locale === "vi"
                  ? "Giữ một buổi dictation ngắn trước, rồi chuyển sang shadowing ngay khi tai còn nhớ rõ câu nói."
                  : "Keep dictation short first, then move straight into shadowing while the line is still fresh in your ear."}
              </p>
            </div>
          </WorkspaceSection>
        </div>
      </section>
    </WorkspaceCanvas>
  );
}
