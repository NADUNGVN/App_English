export function WorkspaceCanvas({ children, className = "" }) {
  return <div className={`workspace-canvas ${className}`}>{children}</div>;
}

export function WorkspaceSection({ children, className = "" }) {
  return <section className={`workspace-section ${className}`}>{children}</section>;
}

export function WorkspaceSectionHeader({ action = null, eyebrow, title, description }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="type-eyebrow-label">{eyebrow}</p>
        ) : null}
        <h2 className="type-title-section">{title}</h2>
        {description ? (
          <p className="type-body-sm max-w-2xl">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
