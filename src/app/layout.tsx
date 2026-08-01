import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/config/env";
import "./globals.css";

export const metadata: Metadata = {
  title: env.appName,
  description: "StudyFlow — focused learning, clear progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey}>
      <html lang="en">
        <body>
          <div className="app-frame">
            <SiteHeader />
            <div className="app-main">{children}</div>
            <SiteFooter />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
