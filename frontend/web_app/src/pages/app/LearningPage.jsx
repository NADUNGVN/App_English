import { MagnifyingGlass } from "@phosphor-icons/react";
import { useDeferredValue, useMemo, useState } from "react";
import {
  WorkspaceCanvas,
  WorkspaceSection,
  WorkspaceSectionHeader,
} from "../../components/app/WorkspaceCanvas.jsx";
import { EmptyState, LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function LearningPage() {
  const { locale } = useAppContext();
  const { data, loading } = useAsyncValue(() => mockContentRepository.getLearning(locale), [locale]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredLessons = useMemo(() => {
    if (!data) {
      return [];
    }

    const needle = deferredSearch.trim().toLowerCase();

    return data.lessons.filter((lesson) => {
      if (!needle) {
        return true;
      }

      return `${lesson.title} ${lesson.description} ${lesson.source}`.toLowerCase().includes(needle);
    });
  }, [data, deferredSearch]);

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  return (
    <WorkspaceCanvas>
      <WorkspaceSection className="border-b border-sand-200">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),340px] xl:items-end">
          <WorkspaceSectionHeader
            eyebrow={locale === "vi" ? "Thư viện" : "Library"}
            title={locale === "vi" ? "Chọn một clip ngắn rồi vào việc ngay." : "Choose a short clip and get into it quickly."}
            description={data.intro}
          />

          <label className="field-shell xl:pb-1">
            <span className="field-label">{locale === "vi" ? "Tìm bài học" : "Find a lesson"}</span>
            <span className="relative">
              <MagnifyingGlass
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                className="field-input pl-11"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="BBC, TED-Ed, speaking, vocabulary..."
                type="search"
                value={search}
              />
            </span>
          </label>
        </div>
      </WorkspaceSection>

      <WorkspaceSection className="border-b border-sand-200">
        <div className="flex flex-wrap gap-3">
          {data.categories.map((item) => (
            <span
              key={item}
              className="rounded-full border border-sand-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </WorkspaceSection>

      <WorkspaceSection>
        {filteredLessons.length === 0 ? (
          <EmptyState
            description={
              locale === "vi"
                ? "Không có bài nào khớp với từ khóa hiện tại. Hãy thử tên nguồn hoặc cấp độ khác."
                : "No lessons match the current search. Try a different source or level."
            }
            title={locale === "vi" ? "Không tìm thấy bài học" : "No lessons found"}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredLessons.map((lesson) => (
              <article key={lesson.id} className="surface-panel-soft overflow-hidden p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{lesson.source}</span>
                      <span className="rounded-full bg-sand-100 px-3 py-1">{lesson.level}</span>
                      <span>{lesson.minutes}m</span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-ink-950">{lesson.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{lesson.description}</p>
                  </div>
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-sm font-semibold text-sage-700">
                    {lesson.tag}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-sand-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink-950">{lesson.progress}%</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </WorkspaceSection>
    </WorkspaceCanvas>
  );
}
