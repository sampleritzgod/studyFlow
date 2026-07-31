import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const label =
    user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "user";

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Signed in as {label}.</p>
      <SignOutButton>
        <button type="button">Sign out</button>
      </SignOutButton>
    </main>
  );
}
