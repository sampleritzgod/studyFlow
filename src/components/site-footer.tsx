import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
    </footer>
  );
}
