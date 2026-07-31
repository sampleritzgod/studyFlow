import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const label =
    user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "user";

  return (
    <main>
      <h1>StudyFlow</h1>
      <p>Project initialized.</p>

      {userId ? (
        <div>
          <p>Signed in as {label}.</p>
          <p>
            <Link href="/dashboard">Go to dashboard</Link>
          </p>
          <SignOutButton>
            <button type="button">Sign out</button>
          </SignOutButton>
        </div>
      ) : (
        <p>
          <Link href="/sign-in">Sign in</Link>
        </p>
      )}
    </main>
  );
}
