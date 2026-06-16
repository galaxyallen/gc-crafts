import { Footer } from "@/components/public/Footer";
import { NavbarWrapper } from "@/components/public/NavbarWrapper";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      <main>{children}</main>
      <Footer />
    </>
  );
}
