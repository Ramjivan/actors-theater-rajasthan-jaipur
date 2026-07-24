// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: "abadfb70-e9fb-460c-ae2c-669955ee9969",
  token: "83f6c59045a263cbb9f68637cc71ca007d6eddd4",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
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
            required: true
          },
          {
            type: "string",
            name: "caption",
            label: "Caption"
          }
        ]
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
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Title"
          },
          {
            type: "datetime",
            name: "date",
            label: "Date"
          },
          {
            type: "string",
            name: "link",
            label: "External Link"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
