// @ts-nocheck
"use client";

import { CrownSimple, Medal, Trophy } from "@phosphor-icons/react";
import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas";
import { LoadingPanel } from "../../components/common/StatePanels";
import { useAppContext } from "../../hooks/useAppContext";
import { useAsyncValue } from "../../hooks/useAsyncValue";
import { mockContentRepository } from "../../repositories/mockContentRepository";

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
          <div className="space-y-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <CrownSimple size={20} weight="duotone" />
            </div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-700">
              {locale === "vi" ? "Xếp hạng" : "Leaderboard"}
            </p>
            <h2 className="text-[1.38rem] font-semibold tracking-[-0.04em] text-ink-950 sm:text-[1.58rem]">
              {data.heading}
            </h2>
            <p className="text-[0.8125rem] leading-relaxed text-slate-500">
              {locale === "vi"
                ? "Bảng xếp hạng hiện tại ưu tiên thời lượng học và độ đều đặn, không chỉ tổng điểm."
                : "The current table rewards study time and consistency, not only raw points."}
            </p>
          </div>
        </WorkspaceSection>

        <div className="divide-y divide-sand-200">
          <WorkspaceSection className="border-b border-sand-200">
            <h3 className="text-[1.22rem] font-semibold tracking-[-0.03em] text-ink-950 sm:text-[1.38rem]">
              {locale === "vi" ? "Nhóm người học nổi bật" : "Standout learners"}
            </h3>
          </WorkspaceSection>

          {data.rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-3 px-3.5 py-3.5 sm:px-4 lg:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  {row.rank <= 3 ? (
                    <Trophy size={17} weight="duotone" />
                  ) : (
                    <Medal size={17} weight="duotone" />
                  )}
                </div>
                <div>
                  <p className="text-[0.8125rem] font-semibold text-ink-950">{row.name}</p>
                  <p className="text-[0.8125rem] text-slate-500">
                    {row.minutes} min · {row.streak} {locale === "vi" ? "ngày" : "days"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[0.95rem] font-semibold text-ink-950">
                  {row.xp} XP
                </p>
                <p className="text-[0.8125rem] text-slate-400">#{row.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceCanvas>
  );
}
