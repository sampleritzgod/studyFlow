export default function FocusLoading() {
  return (
    <main className="site-shell" aria-busy="true" aria-label="Loading focus">
      <section className="page-header">
        <div>
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-lede" />
        </div>
      </section>
      <div className="scorecard-grid">
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row" />
      </div>
    </main>
  );
}
