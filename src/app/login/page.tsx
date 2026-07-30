import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <h1>Sign in</h1>
      <p>Continue with your StudyFlow account.</p>
      <form
        action={async () => {
          "use server";
          await signIn("cognito", { redirectTo: "/dashboard" });
        }}
      >
        <button type="submit">Continue with Cognito</button>
      </form>
    </main>
  );
}
