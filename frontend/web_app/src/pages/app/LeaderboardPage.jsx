import { CrownSimple, Medal, Trophy } from "@phosphor-icons/react";
import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas.jsx";
import { LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function LeaderboardPage() {
  const { locale } = useAppContext();
  const { data, loading } = useAsyncValue(
    () => mockContentRepository.getLeaderboard(locale),
    [locale],
  );

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  return (
    <WorkspaceCanvas>
      <div className="grid lg:grid-cols-[0.9fr,1.1fr]">
        <WorkspaceSection className="border-b border-sand-200 lg:border-b-0 lg:border-r lg:border-sand-200">
          <div className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <CrownSimple size={22} weight="duotone" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
              {locale === "vi" ? "Xếp hạng" : "Leaderboard"}
            </p>
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.05em] text-ink-950 sm:text-[1.9rem]">
              {data.heading}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              {locale === "vi"
                ? "Bảng xếp hạng hiện tại ưu tiên thời lượng học và độ đều đặn, không chỉ tổng điểm."
                : "The current table rewards study time and consistency, not only raw points."}
            </p>
          </div>
        </WorkspaceSection>

        <div className="divide-y divide-sand-200">
          <WorkspaceSection className="border-b border-sand-200">
            <h3 className="text-[1.625rem] font-semibold tracking-[-0.04em] text-ink-950 sm:text-[1.75rem]">
              {locale === "vi" ? "Nhóm người học nổi bật" : "Standout learners"}
            </h3>
          </WorkspaceSection>

          {data.rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  {row.rank <= 3 ? (
                    <Trophy size={18} weight="duotone" />
                  ) : (
                    <Medal size={18} weight="duotone" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-950">{row.name}</p>
                  <p className="text-sm text-slate-500">
                    {row.minutes} min · {row.streak} {locale === "vi" ? "ngày" : "days"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[1.05rem] font-semibold text-ink-950">
                  {row.xp} XP
                </p>
                <p className="text-sm text-slate-400">#{row.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceCanvas>
  );
}
