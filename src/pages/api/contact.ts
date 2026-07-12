// src/pages/api/contact.ts
// Serverless endpoint running on Cloudflare Pages Functions.
// Receives the contact form POST, validates fields, then sends
// the message as an email via MailChannels (free, built into Cloudflare Workers).
//
// DNS setup required on actorstheatrerajasthan.org before emails will deliver:
//   SPF:  add `include:relay.mailchannels.net` to your existing SPF TXT record
//   Lock: add TXT record  _mailchannels.actorstheatrerajasthan.org  →  v=mc1 cfid=actorstheatrerajasthan.org
//
// Both records are added in Cloudflare DNS dashboard (takes < 5 min).

export const prerender = false; // ← This is the only line that makes this route serverless

export async function POST({ request }: { request: Request }): Promise<Response> {
  // ── 1. Parse the incoming form data ─────────────────────────────────────
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400);
  }

  const name    = (data.get('name')    as string | null)?.trim()  || '';
  const email   = (data.get('email')   as string | null)?.trim()  || '';
  const subject = (data.get('subject') as string | null)?.trim()  || 'General Enquiry';
  const message = (data.get('message') as string | null)?.trim()  || '';

  // ── 2. Basic server-side validation ─────────────────────────────────────
  if (!name || !email || !message) {
    return jsonResponse({ error: 'Name, email, and message are required.' }, 422);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: 'Please provide a valid email address.' }, 422);
  }

  // ── 3. Build the plain-text email body ──────────────────────────────────
  const emailBody = [
    `New contact form submission from the ATR website`,
    `${'─'.repeat(48)}`,
    `Name    : ${name}`,
    `Email   : ${email}`,
    `Subject : ${subject}`,
    `${'─'.repeat(48)}`,
    message,
    `${'─'.repeat(48)}`,
    `Sent via actorstheatrerajasthan.org contact form`
  ].join('\n');

  // ── 4. Send via MailChannels (Cloudflare's free transactional email API) ─
  let mcResponse: Response;
  try {
    mcResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'actorsraj@gmail.com', name: 'Actors Theatre Rajasthan' }]
        }],
        from: {
          // Must match a domain you control (the SPF/lock DNS records)
          email: 'website@actorstheatrerajasthan.org',
          name:  'ATR Website'
        },
        // reply-to = the visitor's address so you can just hit Reply in Gmail
        reply_to: { email, name },
        subject: `[ATR Website] ${subject} — from ${name}`,
        content: [{
          type:  'text/plain',
          value: emailBody
        }]
      })
    });
  } catch (err) {
    console.error('MailChannels fetch error:', err);
    return jsonResponse({ error: 'Email service unavailable. Please try WhatsApp.' }, 503);
  }

  // MailChannels returns 202 on success
  if (mcResponse.status === 202) {
    return jsonResponse({ success: true, message: 'Your message has been sent!' }, 200);
  }

  // Surface MailChannels error for debugging
  const mcError = await mcResponse.text().catch(() => '(no body)');
  console.error(`MailChannels error ${mcResponse.status}:`, mcError);
  return jsonResponse({ error: 'Could not send email. Please contact us on WhatsApp.' }, 500);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}
