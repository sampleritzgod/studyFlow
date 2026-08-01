"use server";

import { FocusSessionKind } from "@/generated/prisma/client";
import {
  abandonFocusSession,
  completeFocusSession,
  startFocusSession,
} from "@/lib/focus";
import { POMODORO_MINUTES } from "@/lib/focus-helpers";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function revalidateFocus() {
  revalidatePath("/focus");
}

export async function startPomodoroAction() {
  const userId = await requireUserId();
  try {
    await startFocusSession(userId, {
      kind: FocusSessionKind.POMODORO,
      plannedMinutes: POMODORO_MINUTES,
      label: "Pomodoro",
    });
    revalidateFocus();
    redirect("/focus");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/focus?error=${encodeURIComponent("Could not start Pomodoro.")}`);
  }
}

export async function startBlockAction(formData: FormData) {
  const userId = await requireUserId();
  const label = String(formData.get("label") ?? "");
  const minutesRaw = Number(formData.get("plannedMinutes") ?? 60);
  const plannedMinutes = Number.isFinite(minutesRaw)
    ? Math.min(240, Math.max(5, Math.round(minutesRaw)))
    : 60;

  try {
    await startFocusSession(userId, {
      kind: FocusSessionKind.BLOCK,
      plannedMinutes,
      label: label || "Focus block",
    });
    revalidateFocus();
    redirect("/focus");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/focus?error=${encodeURIComponent("Could not start focus block.")}`);
  }
}

export async function completeSessionAction(formData: FormData) {
  const userId = await requireUserId();
  const sessionId = String(formData.get("sessionId") ?? "");

  try {
    const session = await completeFocusSession(userId, sessionId);
    if (!session) {
      redirect(`/focus?error=${encodeURIComponent("No active session to complete.")}`);
    }
    revalidateFocus();
    redirect("/focus?saved=1");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/focus?error=${encodeURIComponent("Could not complete session.")}`);
  }
}

export async function abandonSessionAction(formData: FormData) {
  const userId = await requireUserId();
  const sessionId = String(formData.get("sessionId") ?? "");

  try {
    const session = await abandonFocusSession(userId, sessionId);
    if (!session) {
      redirect(`/focus?error=${encodeURIComponent("No active session to stop.")}`);
    }
    revalidateFocus();
    redirect("/focus");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    redirect(`/focus?error=${encodeURIComponent("Could not stop session.")}`);
  }
}
