// src/pages/api/admin/upload.ts
// Serverless Cloudflare Pages Function for authenticated photo uploads directly to GitHub.
// Receives image file + admin credentials, verifies against environment variables,
// and commits the photo directly to `public/images/gallery` or `public/images/media`.

export const prerender = false; // Makes this endpoint run as a serverless Cloudflare Function

export async function POST({ request }: { request: Request }): Promise<Response> {
  // ── 1. Parse incoming FormData ──────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form request payload.' }, 400);
  }

  const email    = (formData.get('email') as string | null)?.trim() || '';
  const password = (formData.get('password') as string | null)?.trim() || '';
  const folder   = (formData.get('folder') as string | null)?.trim() || 'gallery';
  const file     = formData.get('file') as File | null;

  // ── 2. Verify Admin Credentials ─────────────────────────────────────────
  const expectedEmail    = import.meta.env.ADMIN_EMAIL;
  const expectedPassword = import.meta.env.ADMIN_PASSWORD;
  const githubRepo       = import.meta.env.GITHUB_REPO;
  const githubToken      = import.meta.env.GITHUB_TOKEN;
  const githubBranch     = import.meta.env.GITHUB_BRANCH || 'main';

  if (!expectedEmail || !expectedPassword || !githubRepo || !githubToken) {
    return jsonResponse({
      error: 'Server configuration missing. Please ensure ADMIN_EMAIL, ADMIN_PASSWORD, GITHUB_REPO, and GITHUB_TOKEN are set in Cloudflare Environment Variables.'
    }, 500);
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return jsonResponse({ error: 'Invalid admin email or password.' }, 401);
  }

  // ── 3. Validate Uploaded File ───────────────────────────────────────────
  if (!file || !(file instanceof File) || file.size === 0) {
    return jsonResponse({ error: 'Please select an image file to upload.' }, 422);
  }

  // Check file size (max 15 MB)
  if (file.size > 15 * 1024 * 1024) {
    return jsonResponse({ error: 'Image size exceeds 15 MB limit. Please compress the image before uploading.' }, 422);
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type.toLowerCase()) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    return jsonResponse({ error: 'Invalid file format. Only JPG, PNG, and WEBP images are supported.' }, 422);
  }

  // ── 4. Generate Clean, URL-Safe Filename ────────────────────────────────
  // Strip spaces & special characters so browsers never fail to load the URL
  const originalName = file.name || 'photo.jpg';
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_') // replace spaces & symbols with underscore
    .replace(/_+/g, '_')        // collapse multiple underscores
    .replace(/^_|_$/g, '')      // trim underscores
    || 'photo';

  const timestamp = Math.floor(Date.now() / 1000);
  const cleanFilename = `${baseName}_${timestamp}.${ext}`;

  const targetSubdir = folder === 'press' ? 'media' : 'gallery';
  const gitFilePath  = `public/images/${targetSubdir}/${cleanFilename}`;

  // ── 5. Convert File to Base64 for GitHub API ────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binaryString = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  const base64Content = btoa(binaryString);

  // ── 6. Commit directly to GitHub via REST API ───────────────────────────
  const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/${gitFilePath}`;

  let githubResponse: Response;
  try {
    githubResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ATR-Cloudflare-Admin-Portal',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `[ATR Admin Portal] Upload photo ${cleanFilename} to ${targetSubdir}`,
        content: base64Content,
        branch: githubBranch
      })
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown network error';
    return jsonResponse({ error: `Failed to connect to GitHub API: ${errMsg}` }, 502);
  }

  if (!githubResponse.ok) {
    const errJson = await githubResponse.json().catch(() => null) as { message?: string } | null;
    const gitMsg = errJson?.message || githubResponse.statusText;
    return jsonResponse({
      error: `GitHub commit failed (${githubResponse.status}): ${gitMsg}. Please verify your GITHUB_TOKEN permissions.`
    }, githubResponse.status);
  }

  const gitResult = await githubResponse.json() as { content?: { html_url?: string } };
  const publicUrl = `/images/${targetSubdir}/${cleanFilename}`;

  return jsonResponse({
    success: true,
    filename: cleanFilename,
    publicUrl,
    commitUrl: gitResult?.content?.html_url || `https://github.com/${githubRepo}`
  }, 200);
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
