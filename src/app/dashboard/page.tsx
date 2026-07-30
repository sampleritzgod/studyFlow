import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signOutFromCognito } from "@/lib/cognito-logout";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Signed in as {session.user.email ?? session.user.name ?? "user"}.</p>
      <form action={signOutFromCognito}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
