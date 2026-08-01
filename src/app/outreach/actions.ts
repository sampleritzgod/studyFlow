"use server";

import {
  createContact,
  createOutreachDraft,
  deleteContact,
  updateContact,
} from "@/lib/outreach";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function revalidateOutreach(contactId?: string) {
  revalidatePath("/outreach");
  if (contactId) revalidatePath(`/outreach/${contactId}`);
}

function contactFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    role: String(formData.get("role") ?? ""),
    relationship: String(formData.get("relationship") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };
}

export async function createContactAction(formData: FormData) {
  const userId = await requireUserId();
  try {
    const contact = await createContact(userId, contactFields(formData));
    revalidateOutreach(contact.id);
    redirect(`/outreach/${contact.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/outreach/new?error=${encodeURIComponent("Could not create contact.")}`);
  }
}

export async function updateContactAction(formData: FormData) {
  const userId = await requireUserId();
  const contactId = String(formData.get("contactId") ?? "");

  try {
    const contact = await updateContact(userId, contactId, contactFields(formData));
    if (!contact) {
      redirect(`/outreach?error=${encodeURIComponent("Contact not found.")}`);
    }
    revalidateOutreach(contactId);
    redirect(`/outreach/${contactId}?saved=1`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/outreach/${contactId}?error=${encodeURIComponent("Could not save contact.")}`);
  }
}

export async function deleteContactAction(formData: FormData) {
  const userId = await requireUserId();
  const contactId = String(formData.get("contactId") ?? "");

  try {
    const ok = await deleteContact(userId, contactId);
    if (!ok) {
      redirect(`/outreach?error=${encodeURIComponent("Contact not found.")}`);
    }
    revalidateOutreach();
    redirect("/outreach");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/outreach/${contactId}?error=${encodeURIComponent("Could not delete contact.")}`);
  }
}

export async function draftEmailAction(formData: FormData) {
  const userId = await requireUserId();
  const contactId = String(formData.get("contactId") ?? "");

  try {
    const draft = await createOutreachDraft(userId, contactId);
    if (!draft) {
      redirect(`/outreach?error=${encodeURIComponent("Contact not found.")}`);
    }
    revalidateOutreach(contactId);
    redirect(`/outreach/${contactId}?drafted=1`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/outreach/${contactId}?error=${encodeURIComponent("Could not draft email.")}`);
  }
}
