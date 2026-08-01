import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  error?: string;
  children?: ReactNode;
};

export function EmptyState({ title, description, error, children }: EmptyStateProps) {
  return (
    <section className="empty-state" aria-live="polite">
      <h2>{title}</h2>
      {description ? <p className="muted">{description}</p> : null}
      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}
      {children}
    </section>
  );
}

type StatusMessageProps = {
  tone: "success" | "error";
  children: ReactNode;
};

export function StatusMessage({ tone, children }: StatusMessageProps) {
  return (
    <p
      className={tone === "success" ? "flash flash-success" : "flash flash-error"}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
