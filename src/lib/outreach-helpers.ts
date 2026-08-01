export type ContactDraftInput = {
  name: string;
  company?: string;
  role?: string;
  relationship?: string;
  notes?: string;
};

export function normalizeContactName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : "Untitled contact";
}

export function draftOutreachEmail(contact: ContactDraftInput): { subject: string; body: string } {
  const name = normalizeContactName(contact.name);
  const company = contact.company?.trim() || "your team";
  const role = contact.role?.trim();
  const relationship = contact.relationship?.trim();
  const context = contact.notes?.trim();

  const subject = role
    ? `Connecting about ${role} opportunities`
    : `Quick hello — would love to connect`;

  const intro = relationship
    ? `I wanted to reach out because ${relationship}.`
    : `I came across your work and wanted to introduce myself.`;

  const companyLine = `I'm especially interested in what ${company} is doing${role ? ` around ${role}` : ""}.`;
  const notesLine = context ? `\n\nContext from my notes: ${context}` : "";

  const body = `Hi ${name.split(" ")[0]},

${intro} ${companyLine}${notesLine}

Would you be open to a short conversation sometime in the next couple of weeks?

Thanks,
[Your name]`;

  return { subject, body };
}
