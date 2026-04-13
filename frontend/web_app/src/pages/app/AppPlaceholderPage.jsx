import { WorkspaceCanvas, WorkspaceSection, WorkspaceSectionHeader } from "../../components/app/WorkspaceCanvas.jsx";
import { EmptyState } from "../../components/common/StatePanels.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";

export function AppPlaceholderPage({ copy }) {
  const { locale } = useAppContext();

  return (
    <WorkspaceCanvas>
      <WorkspaceSection className="border-b border-sand-200">
        <WorkspaceSectionHeader
          eyebrow={copy.eyebrow[locale]}
          title={copy.title[locale]}
          description={copy.description[locale]}
        />
      </WorkspaceSection>

      <WorkspaceSection>
        <EmptyState
          title={copy.emptyTitle[locale]}
          description={copy.emptyDescription[locale]}
        />
      </WorkspaceSection>
    </WorkspaceCanvas>
  );
}
