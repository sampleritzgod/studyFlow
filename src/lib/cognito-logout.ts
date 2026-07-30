"use server";

import { redirect } from "next/navigation";
import { signOut as nextAuthSignOut } from "@/auth";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/** Clears the Auth.js session, then ends the Cognito Hosted UI session. */
export async function signOutFromCognito() {
  await nextAuthSignOut({ redirect: false });

  const domain = required("AUTH_COGNITO_DOMAIN", process.env.AUTH_COGNITO_DOMAIN).replace(
    /\/$/,
    "",
  );
  const clientId = required("AUTH_COGNITO_ID", process.env.AUTH_COGNITO_ID);
  const logoutUri = required("AUTH_URL", process.env.AUTH_URL);

  const logoutUrl = new URL(`${domain}/logout`);
  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set("logout_uri", logoutUri);

  redirect(logoutUrl.toString());
}
