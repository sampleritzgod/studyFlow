export default function NotesLoading() {
  return (
    <main className="site-shell" aria-busy="true" aria-label="Loading notes">
      <section className="dashboard-header">
        <div>
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-lede" />
        </div>
      </section>
      <div className="notes-list">
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row" />
      </div>
    </main>
  );
}
