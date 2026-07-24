import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: "3e17efae-853c-41cb-a290-96dd578f6274",
  token: "dedb487492c91990228cd0e248a3f657c1bae09a",
  
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
