# Actors Theatre Rajasthan (ATR) — Official Website

Official web application for **Actors Theatre Rajasthan (ATR)** — a registered NGO committed to cultural awareness, social transformation, and theatre arts across Rajasthan.

---

## 🚀 Tech Stack & Features

- **Framework:** [Astro 7](https://astro.build/) (Static Site Generation + Serverless API Functions)
- **Deployment & Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/) (`@astrojs/cloudflare` adapter)
- **Automatic Photo Discovery:** Gallery (`/gallery`) and Press (`/press`) pages use `import.meta.glob` to automatically pick up and render images dropped into `public/images/gallery/` and `public/images/media/`.
- **Admin Photo Uploader:** Secure portal at `/admin` backed by Cloudflare Function `/api/admin/upload` allowing non-technical staff to upload images directly to the GitHub repository.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production preview
npm run build
```

---

## 🔐 Admin Photo Uploader Setup (Cloudflare Pages)

To enable authenticated photo uploads via `/admin`, configure the following under **Cloudflare Pages Dashboard → Settings → Environment Variables**:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `ADMIN_EMAIL` | Admin login email | `actorsraj@gmail.com` |
| `ADMIN_PASSWORD` | Secure login password | `YourSecurePassword2026!` |
| `GITHUB_REPO` | GitHub repository (`owner/repo`) | `Ramjivan/actors-theater-rajasthan-jaipur` |
| `GITHUB_BRANCH` | Target branch for commits | `main` |
| `GITHUB_TOKEN` | Fine-grained GitHub PAT with Write access | `github_pat_11...` |

See `.env.example` for detailed steps on generating `GITHUB_TOKEN`.
