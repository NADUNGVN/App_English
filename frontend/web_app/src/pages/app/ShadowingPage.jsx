import { MicrophoneStage } from "@phosphor-icons/react";
import { WorkspaceCanvas, WorkspaceSection } from "../../components/app/WorkspaceCanvas.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";

export function ShadowingPage() {
  const { locale } = useAppContext();

  return (
    <WorkspaceCanvas>
      <WorkspaceSection>
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
            <MicrophoneStage size={24} weight="duotone" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            Shadowing
          </p>
          <h2 className="text-[2.2rem] font-semibold tracking-[-0.05em] text-ink-950 sm:text-[2.5rem]">
            {locale === "vi"
              ? "Màn hình shadowing đang được tách riêng thành phase kế tiếp."
              : "The dedicated shadowing screen is being split into the next build phase."}
          </h2>
          <p className="mx-auto max-w-2xl text-[0.95rem] leading-7 text-slate-500">
            {locale === "vi"
              ? "Kiến trúc route, app shell, ngôn ngữ hiển thị, và trạng thái người dùng đã sẵn sàng để màn này được nối vào sau."
              : "The route architecture, app shell, interface language, and user state are already in place so this screen can be connected next."}
          </p>
        </div>
      </WorkspaceSection>
    </WorkspaceCanvas>
  );
}
