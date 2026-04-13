import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas.jsx";
import { LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function StatisticsPage() {
  const { locale } = useAppContext();
  const { data, loading } = useAsyncValue(
    () => mockContentRepository.getStatistics(locale),
    [locale],
  );

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  return (
    <WorkspaceCanvas>
      <section className="grid border-b border-sand-200 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x xl:divide-sand-200">
        {data.summary.map((item, index) => (
          <div
            key={item.label}
            className={`px-4 py-4 sm:px-5 lg:px-6 ${
              index > 0 ? "border-t border-sand-200 sm:border-t-0" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-3 font-mono text-[2.15rem] font-semibold text-ink-950">
              {item.value}
              <span className="ml-2 font-sans text-base font-medium text-slate-400">
                {item.suffix}
              </span>
            </p>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-[1.12fr,0.88fr]">
        <WorkspaceSection className="border-b border-sand-200 lg:border-b-0 lg:border-r lg:border-sand-200">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            {locale === "vi" ? "Nhịp học tuần này" : "This week's cadence"}
          </p>
          <div className="mt-5 grid gap-3.5">
            {data.bars.map((bar) => (
              <div key={bar.day} className="grid grid-cols-[56px,1fr,48px] items-center gap-3">
                <span className="text-sm text-slate-400">{bar.day}</span>
                <div className="h-3.5 overflow-hidden rounded-full bg-sand-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                    style={{ width: `${Math.min(100, bar.minutes * 2.2)}%` }}
                  />
                </div>
                <span className="text-right font-mono text-sm font-semibold text-ink-950">
                  {bar.minutes}
                </span>
              </div>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            {locale === "vi" ? "Phân bổ kỹ năng" : "Skill balance"}
          </p>
          <div className="mt-5 space-y-4">
            {data.modules.map((module) => (
              <div key={module.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-ink-950">
                    {module.label}
                  </span>
                  <span className="font-mono text-sm font-semibold text-slate-500">
                    {module.value}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-sand-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                    style={{ width: `${module.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </WorkspaceSection>
      </div>
    </WorkspaceCanvas>
  );
}
