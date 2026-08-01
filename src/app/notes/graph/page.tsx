import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getNotesGraph } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function NotesGraphPage() {
  const { userId } = await auth.protect();

  let graph;
  let loadError: string | null = null;

  try {
    graph = await getNotesGraph(userId);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load graph.";
    graph = { nodes: [], edges: [] };
  }

  const width = 640;
  const height = 420;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.34;

  const positions = new Map<string, { x: number; y: number }>();
  graph.nodes.forEach((node, index) => {
    const angle = graph.nodes.length === 0 ? 0 : (index / graph.nodes.length) * Math.PI * 2 - Math.PI / 2;
    positions.set(node.id, {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  });

  return (
    <main className="site-shell">
      <section className="dashboard-header" aria-labelledby="graph-heading">
        <div>
          <p className="eyebrow">Notes</p>
          <h1 id="graph-heading">Note graph</h1>
          <p className="lede">A simple view of how your notes connect.</p>
        </div>
        <div className="action-row">
          <Link className="button button-secondary" href="/notes">
            All notes
          </Link>
          <Link className="button button-primary" href="/notes/new">
            New note
          </Link>
        </div>
      </section>

      {loadError ? (
        <section className="empty-state" aria-live="polite">
          <h2>Could not load graph</h2>
          <p className="error-text" role="alert">
            {loadError}
          </p>
        </section>
      ) : graph.nodes.length === 0 ? (
        <section className="empty-state" aria-live="polite">
          <h2>Nothing to graph yet</h2>
          <p className="muted">Create notes and link them to see relationships here.</p>
          <Link className="button button-primary" href="/notes/new">
            Create a note
          </Link>
        </section>
      ) : (
        <section className="graph-panel" aria-label="Notes relationship graph">
          <svg
            className="notes-graph"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`${graph.nodes.length} notes and ${graph.edges.length} links`}
          >
            {graph.edges.map((edge) => {
              const from = positions.get(edge.fromId);
              const to = positions.get(edge.toId);
              if (!from || !to) return null;
              return (
                <line
                  key={edge.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className="graph-edge"
                />
              );
            })}
            {graph.nodes.map((node) => {
              const point = positions.get(node.id)!;
              const label =
                node.title.length > 18 ? `${node.title.slice(0, 16)}…` : node.title;
              return (
                <g key={node.id}>
                  <a href={`/notes/${node.id}`}>
                    <circle cx={point.x} cy={point.y} r={18} className="graph-node" />
                    <text x={point.x} y={point.y + 36} textAnchor="middle" className="graph-label">
                      {label}
                    </text>
                  </a>
                </g>
              );
            })}
          </svg>
          <ul className="graph-legend">
            {graph.nodes.map((node) => (
              <li key={node.id}>
                <Link href={`/notes/${node.id}`}>{node.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
