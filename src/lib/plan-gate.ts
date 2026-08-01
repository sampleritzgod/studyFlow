import { getUserPlan, isProPlan } from "@/lib/billing";
import { redirect } from "next/navigation";

export async function requirePro(userId: string) {
  const plan = await getUserPlan(userId);
  if (!isProPlan(plan)) {
    redirect("/pricing?gate=pro");
  }
  return plan;
}
