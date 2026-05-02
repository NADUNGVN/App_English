"use client";

import type { ReactNode } from "react";

type WorkspaceCanvasProps = {
  children: ReactNode;
  className?: string;
};

type WorkspaceSectionHeaderProps = {
  action?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export function WorkspaceCanvas({ children, className = "" }: WorkspaceCanvasProps) {
  return <div className={`workspace-canvas ${className}`}>{children}</div>;
}

export function WorkspaceSection({ children, className = "" }: WorkspaceCanvasProps) {
  return <section className={`workspace-section ${className}`}>{children}</section>;
}

export function WorkspaceSectionHeader({
  action = null,
  eyebrow,
  title,
  description,
}: WorkspaceSectionHeaderProps) {
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
