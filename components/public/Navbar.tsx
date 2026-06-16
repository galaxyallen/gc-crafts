"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

const HOME_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "OEM", href: "#oem" },
  { label: "Materials", href: "#materials" },
  { label: "Contact", href: "/contact" },
];

const SUB_LINKS = [
  { label: "Products", href: "/#products", key: "products" },
  { label: "OEM", href: "/oem", key: "oem" },
  { label: "Materials", href: "/#materials", key: "materials" },
  { label: "Contact", href: "/contact", key: "contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const activeKey =
    pathname === "/contact"
      ? "contact"
      : pathname === "/oem"
        ? "oem"
        : pathname.startsWith("/displays") ||
            pathname.startsWith("/trays") ||
            pathname.startsWith("/busts") ||
            pathname.startsWith("/watches")
          ? "products"
          : null;

  return (
    <nav id="nav" className={isHome ? "" : "f"}>
      <div className="nv">
        <Link href="/" className="logo">
          <Logo size={30} />
          <span className="logo-name">GC CRAFTS</span>
        </Link>

        <ul className="nlinks">
          {isHome
            ? HOME_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))
            : SUB_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={activeKey === link.key ? "active" : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
        </ul>

        <Link href="/contact" className="btn">
          <span>Inquire</span>
        </Link>
      </div>
    </nav>
  );
}
