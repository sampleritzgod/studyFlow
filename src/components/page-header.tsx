import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, titleId, description, actions }: PageHeaderProps) {
  return (
    <section className="page-header" aria-labelledby={titleId}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={titleId} className="page-title">
          {title}
        </h1>
        {description ? <p className="lede">{description}</p> : null}
      </div>
      {actions ? <div className="action-row">{actions}</div> : null}
    </section>
  );
}
