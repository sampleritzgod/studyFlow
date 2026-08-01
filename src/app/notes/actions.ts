"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import {
  createNote,
  deleteNote,
  linkNotes,
  unlinkNotes,
  updateNote,
} from "@/lib/notes";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function createNoteAction(formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");

  try {
    const note = await createNote(userId, title, content);
    revalidatePath("/notes");
    revalidatePath("/notes/graph");
    redirect(`/notes/${note.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/notes/new?error=${encodeURIComponent("Could not create note.")}`);
  }
}

export async function updateNoteAction(formData: FormData) {
  const userId = await requireUserId();
  const noteId = String(formData.get("noteId") ?? "");
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");

  try {
    const note = await updateNote(userId, noteId, title, content);
    if (!note) {
      redirect(`/notes?error=${encodeURIComponent("Note not found.")}`);
    }
    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);
    revalidatePath("/notes/graph");
    redirect(`/notes/${noteId}?saved=1`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/notes/${noteId}?error=${encodeURIComponent("Could not save note.")}`);
  }
}

export async function deleteNoteAction(formData: FormData) {
  const userId = await requireUserId();
  const noteId = String(formData.get("noteId") ?? "");

  try {
    const ok = await deleteNote(userId, noteId);
    if (!ok) {
      redirect(`/notes?error=${encodeURIComponent("Note not found.")}`);
    }
    revalidatePath("/notes");
    revalidatePath("/notes/graph");
    redirect("/notes");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/notes/${noteId}?error=${encodeURIComponent("Could not delete note.")}`);
  }
}

export async function linkNoteAction(formData: FormData) {
  const userId = await requireUserId();
  const noteId = String(formData.get("noteId") ?? "");
  const targetId = String(formData.get("targetId") ?? "");

  try {
    await linkNotes(userId, noteId, targetId);
    revalidatePath(`/notes/${noteId}`);
    revalidatePath(`/notes/${targetId}`);
    revalidatePath("/notes/graph");
    redirect(`/notes/${noteId}?linked=1`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Could not link notes.";
    redirect(`/notes/${noteId}?error=${encodeURIComponent(message)}`);
  }
}

export async function unlinkNoteAction(formData: FormData) {
  const userId = await requireUserId();
  const noteId = String(formData.get("noteId") ?? "");
  const targetId = String(formData.get("targetId") ?? "");

  try {
    await unlinkNotes(userId, noteId, targetId);
    revalidatePath(`/notes/${noteId}`);
    revalidatePath(`/notes/${targetId}`);
    revalidatePath("/notes/graph");
    redirect(`/notes/${noteId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/notes/${noteId}?error=${encodeURIComponent("Could not unlink note.")}`);
  }
}
