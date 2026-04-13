import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas.jsx";
import { LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function DictationPage() {
  const { locale } = useAppContext();
  const { data, loading } = useAsyncValue(
    () => mockContentRepository.getDictation(locale),
    [locale],
  );

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  return (
    <WorkspaceCanvas>
      <div className="grid xl:grid-cols-[minmax(0,1.08fr),320px]">
        <div className="min-w-0 border-b border-sand-200 xl:border-b-0 xl:border-r xl:border-sand-200">
          <WorkspaceSection className="border-b border-sand-200">
            <div className="grid gap-4">
              <div className="rounded-[1.55rem] border border-white/80 bg-[rgb(255,248,240)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  {locale === "vi" ? "Đang luyện" : "In progress"}
                </p>
                <div className="mt-3 space-y-2.5">
                  <h2 className="text-[1.75rem] font-semibold tracking-[-0.05em] text-ink-950 sm:text-[1.95rem]">
                    {data.lesson.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {data.summary}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {data.controls.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-sand-200 bg-white px-3.5 py-1.5 text-[0.9375rem] font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </WorkspaceSection>

          <div className="divide-y divide-sand-200">
            {data.segments.map((segment, index) => (
              <article key={segment.id} className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {segment.speaker}
                    </p>
                    <p className="mt-2.5 text-[0.9375rem] leading-6 text-slate-600">
                      {segment.sentence}
                    </p>
                  </div>
                  <span className="rounded-full bg-sand-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {segment.blanks.map((blank) => (
                    <span
                      key={blank}
                      className={`rounded-2xl border px-3.5 py-1.5 text-[0.9375rem] font-medium ${
                        segment.status === "correct"
                          ? "border-sage-200 bg-sage-100 text-sage-700"
                          : segment.status === "review"
                            ? "border-brand-200 bg-brand-50 text-brand-700"
                            : "border-sand-200 bg-white text-slate-500"
                      }`}
                    >
                      {blank}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <WorkspaceSection className="border-b border-sand-200">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
              {locale === "vi" ? "Tổng quan phiên" : "Session summary"}
            </p>
            <div className="mt-4 grid gap-3">
              {[
                {
                  label: locale === "vi" ? "Đã hoàn thành" : "Completed",
                  value: "2 / 3",
                },
                {
                  label: locale === "vi" ? "Độ chính xác tạm thời" : "Current accuracy",
                  value: "91%",
                },
                {
                  label: locale === "vi" ? "Từ mới cần lưu" : "New phrases to save",
                  value: "4",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] border border-sand-200 bg-white/60 p-3.5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-ink-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </WorkspaceSection>

          <WorkspaceSection>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
              {locale === "vi" ? "Gợi ý tiếp theo" : "Next step"}
            </p>
            <p className="mt-3.5 text-sm leading-relaxed text-slate-500">
              {locale === "vi"
                ? "Sau khi chép xong, hãy đọc lại hai câu khó nhất với tốc độ chậm rồi quay lại tốc độ chuẩn."
                : "After dictation, repeat the two toughest lines slowly once, then return to normal speed."}
            </p>
          </WorkspaceSection>
        </div>
      </div>
    </WorkspaceCanvas>
  );
}
