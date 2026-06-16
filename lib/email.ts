import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface InquiryEmailData {
  company: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  role?: string | null;
  interests: string[];
  quantity?: string | null;
  timeline?: string | null;
  message?: string | null;
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  const to = process.env.NOTIFICATION_EMAIL ?? "hello@gccrafts.com";

  const html = `
    <h2>New inquiry from ${data.name} at ${data.company}</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Company</strong></td><td style="padding:8px;border:1px solid #ddd">${data.company}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${data.name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${data.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>WhatsApp</strong></td><td style="padding:8px;border:1px solid #ddd">${data.whatsapp ?? "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Role</strong></td><td style="padding:8px;border:1px solid #ddd">${data.role ?? "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Interests</strong></td><td style="padding:8px;border:1px solid #ddd">${data.interests.join(", ")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Quantity</strong></td><td style="padding:8px;border:1px solid #ddd">${data.quantity ?? "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Timeline</strong></td><td style="padding:8px;border:1px solid #ddd">${data.timeline ?? "-"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${data.message ?? "-"}</td></tr>
    </table>
    <p><a href="${process.env.NEXTAUTH_URL}/admin/inquiries">View in admin panel</a></p>
  `;

  if (!resend) {
    console.log("[Email] Resend not configured. Inquiry notification:", data);
    return;
  }

  await resend.emails.send({
    from: "GC CRAFTS <onboarding@resend.dev>",
    to,
    subject: `New inquiry from ${data.name} at ${data.company}`,
    html,
  });
}
