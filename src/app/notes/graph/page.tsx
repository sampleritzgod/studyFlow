import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getNotesGraph } from "@/lib/notes";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

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
    const angle =
      graph.nodes.length === 0 ? 0 : (index / graph.nodes.length) * Math.PI * 2 - Math.PI / 2;
    positions.set(node.id, {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  });

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Notes"
        title="Note graph"
        titleId="graph-heading"
        description="A simple view of how your notes connect."
        actions={
          <>
            <Button href="/notes" variant="secondary">
              All notes
            </Button>
            <Button href="/notes/new" variant="primary">
              New note
            </Button>
          </>
        }
      />

      {loadError ? (
        <EmptyState title="Could not load graph" error={loadError} />
      ) : graph.nodes.length === 0 ? (
        <EmptyState
          title="Nothing to graph yet"
          description="Create notes and link them to see relationships here."
        >
          <Button href="/notes/new" variant="primary">
            Create a note
          </Button>
        </EmptyState>
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
              const label = node.title.length > 18 ? `${node.title.slice(0, 16)}…` : node.title;
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
