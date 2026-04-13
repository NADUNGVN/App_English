import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas.jsx";
import { EmptyState, LoadingPanel } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";
import { useAsyncValue } from "../../hooks/useAsyncValue.js";
import { mockContentRepository } from "../../repositories/mockContentRepository.js";

export function VocabularyPage() {
  const { locale } = useAppContext();
  const { data, loading } = useAsyncValue(
    () => mockContentRepository.getVocabulary(locale),
    [locale],
  );

  if (loading || !data) {
    return <LoadingPanel className="min-h-[420px]" lines={8} />;
  }

  if (data.words.length === 0) {
    return (
      <EmptyState
        description={
          locale === "vi"
            ? "Từ mới sẽ xuất hiện ở đây sau khi bạn lưu chúng từ các bài luyện."
            : "New words will appear here after you save them from practice sessions."
        }
        title={locale === "vi" ? "Chưa có từ vựng nào" : "No vocabulary saved yet"}
      />
    );
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
            <p className="mt-3 text-[2.15rem] font-semibold tracking-[-0.05em] text-ink-950">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <WorkspaceSection className="border-b border-sand-200">
        <h2 className="text-[1.625rem] font-semibold tracking-[-0.04em] text-ink-950 sm:text-[1.75rem]">
          {locale === "vi" ? "Danh sách từ đang học" : "Vocabulary in rotation"}
        </h2>
      </WorkspaceSection>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-white/60 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <tr>
              <th className="px-5 py-3.5">{locale === "vi" ? "Từ" : "Term"}</th>
              <th className="px-5 py-3.5">{locale === "vi" ? "Nghĩa" : "Meaning"}</th>
              <th className="px-5 py-3.5">{locale === "vi" ? "Ví dụ" : "Example"}</th>
              <th className="px-5 py-3.5">{locale === "vi" ? "Mức" : "Level"}</th>
              <th className="px-5 py-3.5">{locale === "vi" ? "Độ vững" : "Mastery"}</th>
            </tr>
          </thead>
          <tbody>
            {data.words.map((word) => (
              <tr key={word.id} className="border-t border-sand-200 align-top">
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <p className="text-[1.05rem] font-semibold text-ink-950">
                      {word.term}
                    </p>
                    <p className="text-sm capitalize text-slate-500">{word.status}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{word.meaning}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{word.example}</td>
                <td className="px-5 py-4 text-sm font-semibold text-brand-700">
                  {word.level}
                </td>
                <td className="px-5 py-4">
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sage-600"
                        style={{ width: `${word.mastery}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-ink-950">
                      {word.mastery}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WorkspaceCanvas>
  );
}
