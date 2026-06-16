"use client";

import { useState } from "react";

const INTERESTS = [
  { value: "displays", label: "Displays" },
  { value: "trays", label: "Trays" },
  { value: "busts", label: "Busts" },
  { value: "watches", label: "Watches" },
  { value: "oem", label: "OEM / Custom" },
];

export function InquiryForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("website")) {
      setSent(true);
      return;
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: data.get("company"),
          name: data.get("name"),
          email: data.get("email"),
          whatsapp: data.get("whatsapp") || undefined,
          role: data.get("role") || undefined,
          interests,
          quantity: data.get("quantity") || undefined,
          timeline: data.get("timeline") || undefined,
          message: data.get("message") || undefined,
          website: data.get("website"),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      setSent(true);
      form.reset();
      setInterests([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contact-form rv d1">
      <h3>Project inquiry</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

        <div className="fr">
          <div className="fg">
            <label>Company</label>
            <input type="text" name="company" placeholder="Your company name" required />
          </div>
          <div className="fg">
            <label>Your name</label>
            <input type="text" name="name" placeholder="Full name" required />
          </div>
        </div>

        <div className="fr">
          <div className="fg">
            <label>Your role</label>
            <input type="text" name="role" placeholder="e.g. Buyer, VM Director" />
          </div>
          <div className="fg">
            <label>Email</label>
            <input type="email" name="email" placeholder="your@company.com" required />
          </div>
        </div>

        <div className="fr">
          <div className="fg">
            <label>WhatsApp</label>
            <input type="tel" name="whatsapp" placeholder="+1 000 000 0000" />
          </div>
          <div className="fg" />
        </div>

        <div className="ff">
          <div className="fg">
            <label>Interested in</label>
          </div>
          <div className="fchk">
            {INTERESTS.map((item) => (
              <label key={item.value}>
                <input
                  type="checkbox"
                  checked={interests.includes(item.value)}
                  onChange={() =>
                    setInterests((prev) =>
                      prev.includes(item.value)
                        ? prev.filter((v) => v !== item.value)
                        : [...prev, item.value]
                    )
                  }
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="fr">
          <div className="fg">
            <label>Quantity</label>
            <select name="quantity" defaultValue="">
              <option value="">Select range</option>
              <option>50 – 200 sets</option>
              <option>200 – 500 sets</option>
              <option>500 – 1000 sets</option>
              <option>1000+ sets</option>
            </select>
          </div>
          <div className="fg">
            <label>Timeline</label>
            <select name="timeline" defaultValue="">
              <option value="">When do you need it?</option>
              <option>Within 1 month</option>
              <option>1 – 3 months</option>
              <option>3 – 6 months</option>
              <option>Just exploring</option>
            </select>
          </div>
        </div>

        <div className="ff">
          <div className="fg">
            <label>Project brief</label>
            <textarea
              name="message"
              placeholder="Describe your vision — materials, style references, branding requirements, anything that helps us understand your needs..."
            />
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{error}</p>}

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button type="submit" className="btn btn-f" disabled={loading || sent}>
            <span>{sent ? "Sent — thank you" : loading ? "Sending..." : "Send inquiry"}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22l-4-9-9-4z" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--t3)", marginTop: 14 }}>
          We respond within 24 hours with an initial concept direction.
        </p>
      </form>
    </div>
  );
}
