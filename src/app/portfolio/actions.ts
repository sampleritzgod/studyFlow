"use server";

import {
  addChecklistItem,
  createMilestone,
  deleteChecklistItem,
  deleteMilestone,
  toggleChecklistItem,
  updateMilestone,
} from "@/lib/portfolio";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function revalidatePortfolio(milestoneId?: string) {
  revalidatePath("/portfolio");
  if (milestoneId) revalidatePath(`/portfolio/${milestoneId}`);
}

export async function createMilestoneAction(formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");

  try {
    const milestone = await createMilestone(userId, title, description);
    revalidatePortfolio(milestone.id);
    redirect(`/portfolio/${milestone.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/portfolio/new?error=${encodeURIComponent("Could not create milestone.")}`);
  }
}

export async function updateMilestoneAction(formData: FormData) {
  const userId = await requireUserId();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");

  try {
    const milestone = await updateMilestone(userId, milestoneId, title, description);
    if (!milestone) {
      redirect(`/portfolio?error=${encodeURIComponent("Milestone not found.")}`);
    }
    revalidatePortfolio(milestoneId);
    redirect(`/portfolio/${milestoneId}?saved=1`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Could not save milestone.")}`);
  }
}

export async function deleteMilestoneAction(formData: FormData) {
  const userId = await requireUserId();
  const milestoneId = String(formData.get("milestoneId") ?? "");

  try {
    const ok = await deleteMilestone(userId, milestoneId);
    if (!ok) {
      redirect(`/portfolio?error=${encodeURIComponent("Milestone not found.")}`);
    }
    revalidatePortfolio();
    redirect("/portfolio");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Could not delete milestone.")}`);
  }
}

export async function addChecklistItemAction(formData: FormData) {
  const userId = await requireUserId();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const title = String(formData.get("title") ?? "");

  try {
    const item = await addChecklistItem(userId, milestoneId, title);
    if (!item) {
      redirect(`/portfolio?error=${encodeURIComponent("Milestone not found.")}`);
    }
    revalidatePortfolio(milestoneId);
    redirect(`/portfolio/${milestoneId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Could not add checklist item.")}`);
  }
}

export async function toggleChecklistItemAction(formData: FormData) {
  const userId = await requireUserId();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");

  try {
    const item = await toggleChecklistItem(userId, itemId);
    if (!item) {
      redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Item not found.")}`);
    }
    revalidatePortfolio(milestoneId);
    redirect(`/portfolio/${milestoneId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Could not update item.")}`);
  }
}

export async function deleteChecklistItemAction(formData: FormData) {
  const userId = await requireUserId();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");

  try {
    const ok = await deleteChecklistItem(userId, itemId);
    if (!ok) {
      redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Item not found.")}`);
    }
    revalidatePortfolio(milestoneId);
    redirect(`/portfolio/${milestoneId}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/portfolio/${milestoneId}?error=${encodeURIComponent("Could not delete item.")}`);
  }
}
