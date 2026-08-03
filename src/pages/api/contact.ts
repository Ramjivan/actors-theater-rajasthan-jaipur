import type { APIContext } from 'astro';

export const prerender = false; // Makes this route serverless

export async function POST(context: APIContext): Promise<Response> {
  const { request, locals } = context;
  
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

  // ── 3. Check for Cloudflare Email Binding ───────────────────────────────
  const env = (locals as any).runtime?.env;
  if (!env || !env.SEND_EMAIL) {
    console.error('Missing SEND_EMAIL binding in Cloudflare environment.');
    return jsonResponse({ error: 'Email service configuration missing. Please try WhatsApp.' }, 500);
  }

  // ── 4. Build the plain-text email body & RFC 822 Message ────────────────
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



  // ── 5. Send using Native Cloudflare Email Worker Binding ────────────────
  try {
    // According to the new Cloudflare Email Service binding API
    await env.SEND_EMAIL.send({
      from: 'website@actorstheatrerajasthan.org',
      to: 'actorsraj@gmail.com',
      subject: `[ATR Website] ${subject} — from ${name}`,
      text: emailBody
    });
  } catch (err: any) {
    console.error('Cloudflare Email Worker error:', err);
    return jsonResponse({ error: 'Could not send email (' + err.message + '). Please contact us on WhatsApp.' }, 500);
  }

  return jsonResponse({ success: true, message: 'Your message has been sent!' }, 200);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}
