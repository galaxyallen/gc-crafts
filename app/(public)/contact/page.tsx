import type { Metadata } from "next";
import Link from "next/link";
import { getContentMap, getSettingsMap } from "@/lib/content";
import { CmsTitle } from "@/lib/cms-title";
import { PageHero } from "@/components/public/PageHero";
import { InquiryForm } from "@/components/public/InquiryForm";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with GC CRAFTS for bespoke jewelry display inquiries.",
};

export default async function ContactPage() {
  const [settings, contentMap] = await Promise.all([
    getSettingsMap(),
    getContentMap(["page_contact"]),
  ]);

  const pageContact = contentMap.page_contact;
  const email = settings.email ?? "hello@gccrafts.com";
  const whatsapp = settings.whatsapp ?? "";
  const address1 = settings.address_1 ?? "Guangzhou, Guangdong, China";
  const address2 = settings.address_2 ?? "Hong Kong SAR, China";
  const instagram = settings.instagram ?? "#";
  const linkedin = settings.linkedin ?? "#";
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d+]/g, "")}` : "#";

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        tagline={pageContact?.subtitle ?? "Get in touch"}
        title={
          pageContact?.title ? (
            <CmsTitle text={pageContact.title} />
          ) : (
            <>
              Let&apos;s create something
              <br />
              <em>extraordinary</em>
            </>
          )
        }
        description={
          pageContact?.body ??
          "Whether you're looking for standard products or a fully custom OEM solution, we'd love to hear from you."
        }
        backgroundImage={pageContact?.image}
      />

      <div className="sec-line" />

      <section style={{ background: "var(--char-d)" }}>
        <div className="w">
          <div className="contact-layout">
            <div className="contact-info rv">
              <h3>
                Direct <em>channels</em>
              </h3>
              <p>
                We respond within 24 hours on all channels. For urgent inquiries, WhatsApp is the fastest way to
                reach us.
              </p>

              <div className="c-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <strong>Email</strong>
                  <Link href={`mailto:${email}`}>{email}</Link>
                </div>
              </div>

              <div className="c-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                <div>
                  <strong>WhatsApp</strong>
                  <Link href={whatsappHref}>{whatsapp || "+852 xxxx xxxx"}</Link>
                </div>
              </div>

              <div className="c-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>Showroom — Guangzhou</strong>
                  {address1}
                  <br />
                  <span style={{ fontSize: 11, color: "var(--t3)" }}>Visits by appointment</span>
                </div>
              </div>

              <div className="c-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>Office — Hong Kong</strong>
                  {address2}
                </div>
              </div>

              <div className="social-row">
                <Link href={instagram} className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
                  </svg>
                </Link>
                <Link href={linkedin} className="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
              </div>
            </div>

            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
