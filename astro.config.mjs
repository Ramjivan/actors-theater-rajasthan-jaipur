// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // All pages are static (CDN) by default in Astro 7.
  // src/pages/api/contact.ts has `export const prerender = false`
  // which makes it run as a Cloudflare Pages Function (serverless).
  output: "server",
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: false  // disabled in production to prevent wrangler.json validation errors during build
    }
  }),
  vite: {
    build: {
      rollupOptions: {
        external: ['next/headers']
      },
      rolldownOptions: {
        external: ['next/headers']
      }
    }
  },
  site: 'https://actorstheatrerajasthan.org',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin')
    })
  ]
});
