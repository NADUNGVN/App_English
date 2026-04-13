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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>
        ) : null}
        <h2 className="page-heading text-[1.625rem] sm:text-[1.75rem]">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
