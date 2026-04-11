import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas.jsx";
import { EmptyState, LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function DictionaryPage() {
  const { locale } = useAppContext();
  const { data, loading } = useAsyncValue(() => mockContentRepository.getDictionary(locale), [locale]);
  const [query, setQuery] = useState("resilient");

  const match = useMemo(() => {
    if (!data) {
      return null;
    }

    const needle = query.trim().toLowerCase();
    return data.entries.find((item) => item.term.toLowerCase().includes(needle)) ?? null;
  }, [data, query]);

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  return (
    <WorkspaceCanvas>
      <div className="grid lg:grid-cols-[minmax(0,1.05fr),320px]">
        <div className="min-w-0 border-b border-sand-200 lg:border-b-0 lg:border-r lg:border-sand-200">
          <WorkspaceSection className="border-b border-sand-200">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  {locale === "vi" ? "Từ điển" : "Dictionary"}
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.05em] text-ink-950">
                  {locale === "vi" ? "Tra nghĩa nhanh và giữ ngữ cảnh gần bên." : "Look up meaning fast and keep the context nearby."}
                </h2>
              </div>

              <label className="field-shell">
                <span className="field-label">{locale === "vi" ? "Tìm từ" : "Search term"}</span>
                <span className="relative">
                  <MagnifyingGlass
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    className="field-input pl-11"
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    value={query}
                  />
                </span>
              </label>
            </div>
          </WorkspaceSection>

          <WorkspaceSection>
            {match ? (
              <div className="rounded-[1.7rem] border border-white/80 bg-[rgb(255,248,240)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold tracking-[-0.05em] text-ink-950">{match.term}</h3>
                    <p className="mt-1 font-mono text-sm text-slate-500">{match.phonetic}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                    {locale === "vi" ? "Đang tra" : "Active"}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{match.meaning}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{match.example}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {match.synonyms.map((synonym) => (
                    <span
                      key={synonym}
                      className="rounded-full border border-sand-200 bg-white px-3 py-1 text-sm text-slate-500"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                description={
                  locale === "vi"
                    ? "Không tìm thấy từ khớp với truy vấn hiện tại."
                    : "No dictionary entry matches the current query."
                }
                title={locale === "vi" ? "Chưa có kết quả" : "No result yet"}
              />
            )}
          </WorkspaceSection>
        </div>

        <WorkspaceSection>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {locale === "vi" ? "Tra gần đây" : "Recent lookups"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {data.recent.map((term) => (
              <button
                key={term}
                className="rounded-full border border-sand-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-200 hover:text-ink-950"
                onClick={() => setQuery(term)}
                type="button"
              >
                {term}
              </button>
            ))}
          </div>
        </WorkspaceSection>
      </div>
    </WorkspaceCanvas>
  );
}
