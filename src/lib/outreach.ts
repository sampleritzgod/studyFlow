import { draftOutreachEmail, normalizeContactName } from "@/lib/outreach-helpers";
import { getPrisma } from "@/lib/prisma";

export type ContactSummary = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  updatedAt: Date;
  draftCount: number;
};

export type OutreachDraftSummary = {
  id: string;
  subject: string;
  body: string;
  createdAt: Date;
};

export type ContactDetail = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  relationship: string;
  notes: string;
  lastContactAt: Date | null;
  updatedAt: Date;
  drafts: OutreachDraftSummary[];
};

export async function listContacts(userId: string): Promise<ContactSummary[]> {
  const prisma = getPrisma();
  const rows = await prisma.contact.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { drafts: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    updatedAt: row.updatedAt,
    draftCount: row._count.drafts,
  }));
}

export async function getContact(userId: string, contactId: string): Promise<ContactDetail | null> {
  const prisma = getPrisma();
  const row = await prisma.contact.findFirst({
    where: { id: contactId, userId },
    include: {
      drafts: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    relationship: row.relationship,
    notes: row.notes,
    lastContactAt: row.lastContactAt,
    updatedAt: row.updatedAt,
    drafts: row.drafts.map((draft) => ({
      id: draft.id,
      subject: draft.subject,
      body: draft.body,
      createdAt: draft.createdAt,
    })),
  };
}

export async function createContact(
  userId: string,
  input: {
    name: string;
    email: string;
    company: string;
    role: string;
    relationship: string;
    notes: string;
  },
) {
  const prisma = getPrisma();
  return prisma.contact.create({
    data: {
      userId,
      name: normalizeContactName(input.name),
      email: input.email.trim(),
      company: input.company.trim(),
      role: input.role.trim(),
      relationship: input.relationship.trim(),
      notes: input.notes.trim(),
    },
  });
}

export async function updateContact(
  userId: string,
  contactId: string,
  input: {
    name: string;
    email: string;
    company: string;
    role: string;
    relationship: string;
    notes: string;
  },
) {
  const prisma = getPrisma();
  const existing = await prisma.contact.findFirst({ where: { id: contactId, userId } });
  if (!existing) return null;

  return prisma.contact.update({
    where: { id: contactId },
    data: {
      name: normalizeContactName(input.name),
      email: input.email.trim(),
      company: input.company.trim(),
      role: input.role.trim(),
      relationship: input.relationship.trim(),
      notes: input.notes.trim(),
    },
  });
}

export async function deleteContact(userId: string, contactId: string) {
  const prisma = getPrisma();
  const existing = await prisma.contact.findFirst({ where: { id: contactId, userId } });
  if (!existing) return false;
  await prisma.contact.delete({ where: { id: contactId } });
  return true;
}

export async function createOutreachDraft(userId: string, contactId: string) {
  const prisma = getPrisma();
  const contact = await prisma.contact.findFirst({ where: { id: contactId, userId } });
  if (!contact) return null;

  const draft = draftOutreachEmail({
    name: contact.name,
    company: contact.company,
    role: contact.role,
    relationship: contact.relationship,
    notes: contact.notes,
  });

  const created = await prisma.outreachDraft.create({
    data: {
      userId,
      contactId,
      subject: draft.subject,
      body: draft.body,
    },
  });

  await prisma.contact.update({
    where: { id: contactId },
    data: { lastContactAt: new Date() },
  });

  return created;
}
