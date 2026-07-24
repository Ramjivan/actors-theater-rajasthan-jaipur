import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  // Only protect the TinaCMS routes
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/tina")) {
    const authHeader = request.headers.get("authorization");
    const adminEmail = process.env.TINA_ADMIN_EMAIL || "admin";
    const adminPassword = process.env.TINA_ADMIN_PASSWORD || "admin";

    // Expected format: "Basic base64(email:password)"
    const expectedAuth = "Basic " + btoa(`${adminEmail}:${adminPassword}`);

    if (!authHeader || authHeader !== expectedAuth) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="TinaCMS Admin Area"',
        },
      });
    }
  }

  return next();
});
