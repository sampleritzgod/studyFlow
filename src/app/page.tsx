import Link from "next/link";
import { auth } from "@/auth";
import { signOutFromCognito } from "@/lib/cognito-logout";

export default async function HomePage() {
  const session = await auth();

  return (
    <main>
      <h1>StudyFlow</h1>
      <p>Project initialized.</p>

      {session?.user ? (
        <div>
          <p>Signed in as {session.user.email ?? session.user.name ?? "user"}.</p>
          <p>
            <Link href="/dashboard">Go to dashboard</Link>
          </p>
          <form action={signOutFromCognito}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      ) : (
        <p>
          <Link href="/login">Sign in</Link>
        </p>
      )}
    </main>
  );
}
