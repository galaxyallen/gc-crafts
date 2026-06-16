import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export type SiteSettings = Record<string, string>;

export function Footer() {
  return (
    <footer>
      <div className="w">
        <div className="frow">
          <div className="fbrand">
            <Logo size={22} />
            <span className="logo-name">GC CRAFTS</span>
          </div>
          <div className="fk">
            <Link href="/displays">Displays</Link>
            <Link href="/trays">Trays</Link>
            <Link href="/busts">Busts</Link>
            <Link href="/watches">Watches</Link>
            <Link href="/oem">OEM</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="fcopy">&copy; {new Date().getFullYear()} GC CRAFTS — Guangzhou & Hong Kong. All rights reserved.</div>
      </div>
    </footer>
  );
}
