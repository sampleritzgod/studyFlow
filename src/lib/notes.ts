import { getPrisma } from "@/lib/prisma";
import { canonicalLinkPair, normalizeNoteTitle } from "@/lib/note-helpers";

export type NoteSummary = {
  id: string;
  title: string;
  updatedAt: Date;
};

export type NoteDetail = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  linkedNotes: NoteSummary[];
};

export async function listNotes(userId: string): Promise<NoteSummary[]> {
  const prisma = getPrisma();
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
}

export async function getNote(userId: string, noteId: string): Promise<NoteDetail | null> {
  const prisma = getPrisma();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: {
      outgoingLinks: {
        include: { toNote: { select: { id: true, title: true, updatedAt: true } } },
      },
      incomingLinks: {
        include: { fromNote: { select: { id: true, title: true, updatedAt: true } } },
      },
    },
  });

  if (!note) return null;

  const linkedById = new Map<string, NoteSummary>();
  for (const link of note.outgoingLinks) {
    linkedById.set(link.toNote.id, link.toNote);
  }
  for (const link of note.incomingLinks) {
    linkedById.set(link.fromNote.id, link.fromNote);
  }

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    linkedNotes: [...linkedById.values()].sort((a, b) => a.title.localeCompare(b.title)),
  };
}

export async function createNote(userId: string, title: string, content: string) {
  const prisma = getPrisma();
  return prisma.note.create({
    data: {
      userId,
      title: normalizeNoteTitle(title),
      content,
    },
  });
}

export async function updateNote(
  userId: string,
  noteId: string,
  title: string,
  content: string,
) {
  const prisma = getPrisma();
  const existing = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!existing) return null;

  return prisma.note.update({
    where: { id: noteId },
    data: {
      title: normalizeNoteTitle(title),
      content,
    },
  });
}

export async function deleteNote(userId: string, noteId: string) {
  const prisma = getPrisma();
  const existing = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!existing) return false;

  await prisma.note.delete({ where: { id: noteId } });
  return true;
}

/** Creates undirected adjacency: one directed row; graph/list query both directions. */
export async function linkNotes(userId: string, fromNoteId: string, toNoteId: string) {
  if (fromNoteId === toNoteId) {
    throw new Error("A note cannot link to itself.");
  }

  const prisma = getPrisma();
  const [from, to] = await Promise.all([
    prisma.note.findFirst({ where: { id: fromNoteId, userId } }),
    prisma.note.findFirst({ where: { id: toNoteId, userId } }),
  ]);

  if (!from || !to) {
    throw new Error("One or both notes were not found.");
  }

  const [a, b] = canonicalLinkPair(fromNoteId, toNoteId);

  return prisma.noteLink.upsert({
    where: { fromNoteId_toNoteId: { fromNoteId: a, toNoteId: b } },
    create: { userId, fromNoteId: a, toNoteId: b },
    update: {},
  });
}

export async function unlinkNotes(userId: string, fromNoteId: string, toNoteId: string) {
  const prisma = getPrisma();
  const [a, b] = canonicalLinkPair(fromNoteId, toNoteId);

  await prisma.noteLink.deleteMany({
    where: { userId, fromNoteId: a, toNoteId: b },
  });
}

export type GraphData = {
  nodes: { id: string; title: string }[];
  edges: { id: string; fromId: string; toId: string }[];
};

export async function getNotesGraph(userId: string): Promise<GraphData> {
  const prisma = getPrisma();
  const [notes, links] = await Promise.all([
    prisma.note.findMany({
      where: { userId },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.noteLink.findMany({
      where: { userId },
      select: { id: true, fromNoteId: true, toNoteId: true },
    }),
  ]);

  return {
    nodes: notes,
    edges: links.map((link) => ({
      id: link.id,
      fromId: link.fromNoteId,
      toId: link.toNoteId,
    })),
  };
}
