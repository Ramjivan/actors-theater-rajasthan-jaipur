import { defineConfig, LocalAuthProvider } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || "dummy-client-id",
  token: process.env.TINA_TOKEN || "dummy-token",
  
  // Authentication is handled at the network level by Astro Middleware
  authProvider: new LocalAuthProvider(),
  contentApiUrlOverride: "/api/tina/gql",
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "gallery",
        label: "Gallery Photos",
        path: "content/gallery",
        format: "json",
        fields: [
          {
            type: "image",
            name: "image",
            label: "Image",
            required: true,
          },
          {
            type: "string",
            name: "caption",
            label: "Caption",
          },
        ],
      },
      {
        name: "press",
        label: "Press & Media",
        path: "content/press",
        format: "json",
        fields: [
          {
            type: "image",
            name: "image",
            label: "Press Image",
            required: true,
          },
          {
            type: "string",
            name: "title",
            label: "Title",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "link",
            label: "External Link",
          },
        ],
      },
    ],
  },
});
