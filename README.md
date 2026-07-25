# Actors Theatre Rajasthan (ATR) — Official Website

Official web application for **Actors Theatre Rajasthan (ATR)** — a registered NGO committed to cultural awareness, social transformation, and theatre arts across Rajasthan.

---

## 🚀 Tech Stack & Features

- **Framework:** [Astro 7](https://astro.build/) (Static Site Generation + Serverless API Functions)
- **Deployment & Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/) (`@astrojs/cloudflare` adapter)
- **Content Management:** Fully integrated with [Pages CMS](https://pagescms.org/), providing a user-friendly GUI to edit text, upload images, and manage collections (Activities, Productions, Media, etc.).
- **Data Architecture:** Content is stored as decoupled JSON in `content/` and `src/content/pages/` mapped via `.pages.yml`.

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

## 📝 Content Management (Pages CMS)

This website uses **Pages CMS** for all content updates.

1. **Accessing the CMS:** Navigate to `yoursite.com/admin` (which redirects to Pages CMS) or go directly to [Pages CMS](https://pagescms.org/).
2. **Login:** Log in with the GitHub account that has access to this repository.
3. **Usage:** You can edit Homepage content, add new Photo Gallery images, create Theatre Productions, and update policies. Changes made in Pages CMS are automatically committed to the repository and deployed by Cloudflare Pages.
